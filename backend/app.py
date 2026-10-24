import csv
import io
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").split(",")}})

PROJECT_ROOT = Path(__file__).resolve().parents[1]
LOCAL_CSV = Path(os.getenv("STUDENT_CSV_PATH", str(Path.home() / "student-performance" / "student_performance.csv")))
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "ap-south-1")
S3_BUCKET = os.getenv("S3_BUCKET", "").strip()
S3_RAW_KEY = os.getenv("S3_RAW_KEY", "raw/student_performance.csv")
S3_RESULT_KEY = os.getenv("S3_RESULT_KEY", "results/average/part-m-00000")
HDFS_OUTPUT = os.getenv("HDFS_OUTPUT", "/student/output/average")
HADOOP_HOME = os.getenv("HADOOP_HOME", "")
HADOOP_CMD = os.getenv("HADOOP_CMD", str(Path(HADOOP_HOME) / "bin" / "hadoop.cmd") if HADOOP_HOME else "hadoop")
HADOOP_JAR = os.getenv("HADOOP_JAR", str(Path.home() / "student-performance" / "AverageExam.jar"))
HADOOP_MAIN_CLASS = os.getenv("HADOOP_MAIN_CLASS", "AverageExam")
HDFS_INPUT = os.getenv("HDFS_INPUT", "/student/input/student_performance.csv")

FIELD_NAMES = ["StudentID", "Attendance", "StudyHours", "PreviousScore", "AssignmentMarks", "ExamMarks"]


def category(mark):
    if mark >= 85:
        return "Excellent"
    if mark >= 70:
        return "Good"
    if mark >= 50:
        return "Satisfactory"
    return "Needs Support"


def s3_client():
    return boto3.client("s3", region_name=AWS_REGION)


def read_csv_text():
    """Prefer the configured S3 raw object; fall back to the user's local CSV."""
    if S3_BUCKET:
        try:
            obj = s3_client().get_object(Bucket=S3_BUCKET, Key=S3_RAW_KEY)
            return obj["Body"].read().decode("utf-8-sig"), f"AWS S3 s3://{S3_BUCKET}/{S3_RAW_KEY}"
        except (ClientError, BotoCoreError, UnicodeDecodeError):
            pass
    if not LOCAL_CSV.exists():
        raise FileNotFoundError(
            f"CSV not found at {LOCAL_CSV}. Set STUDENT_CSV_PATH in backend/.env or upload {S3_RAW_KEY} to your configured S3 bucket."
        )
    return LOCAL_CSV.read_text(encoding="utf-8-sig"), f"Local CSV: {LOCAL_CSV}"


def read_students():
    csv_text, source = read_csv_text()
    records = []
    reader = csv.DictReader(io.StringIO(csv_text))
    missing = [name for name in FIELD_NAMES if name not in (reader.fieldnames or [])]
    if missing:
        raise ValueError("CSV is missing required columns: " + ", ".join(missing))
    for row in reader:
        if not row.get("StudentID"):
            continue
        try:
            record = {"StudentID": row["StudentID"].strip()}
            for field in FIELD_NAMES[1:]:
                record[field] = float(row[field]) if field == "StudyHours" else int(float(row[field]))
            record["PerformanceCategory"] = category(record["ExamMarks"])
            records.append(record)
        except (ValueError, TypeError):
            # Skip malformed records; do not fabricate replacements.
            continue
    return records, source


def hdfs_average():
    """Read the output produced by the configured local Hadoop installation."""
    cmd = [HADOOP_CMD, "fs", "-cat", f"{HDFS_OUTPUT}/part-m-00000"]
    try:
        completed = subprocess.run(cmd, capture_output=True, text=True, timeout=15, shell=False)
        if completed.returncode != 0:
            return None, "NOT_FOUND", completed.stderr.strip()[-500:]
        for line in completed.stdout.splitlines():
            parts = line.split()
            if len(parts) >= 2:
                try:
                    return float(parts[-1]), "COMPLETED", ""
                except ValueError:
                    continue
        return None, "NO_OUTPUT", "Hadoop output did not contain a numeric average."
    except (OSError, subprocess.TimeoutExpired) as exc:
        return None, "UNAVAILABLE", str(exc)


def s3_status():
    if not S3_BUCKET:
        return False, "Not configured"
    try:
        s3_client().head_bucket(Bucket=S3_BUCKET)
        return True, f"Connected: s3://{S3_BUCKET}/"
    except (ClientError, BotoCoreError) as exc:
        return True, f"Configured, access check failed: {str(exc)[:180]}"


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "StudentPulse API", "time": datetime.now(timezone.utc).isoformat()})


@app.get("/api/students")
def students_endpoint():
    try:
        records, source = read_students()
        return jsonify({"students": records, "count": len(records), "source": source})
    except (OSError, ValueError, ClientError, BotoCoreError) as exc:
        return jsonify({"error": str(exc)}), 503


@app.get("/api/pipeline")
def pipeline_endpoint():
    average, status, detail = hdfs_average()
    configured, storage_status = s3_status()
    try:
        records, source = read_students()
        count = len(records)
    except Exception as exc:
        source, count = "Unavailable", 0
        detail = detail or str(exc)
    return jsonify({
        "source": source,
        "hadoopStatus": status,
        "hadoopAverage": average,
        "hdfsOutput": f"{HDFS_OUTPUT}/part-m-00000",
        "s3Configured": configured,
        "s3Status": storage_status,
        "lastUpdated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "recordCount": count,
        "error": detail or None,
    })


@app.post("/api/sync-s3")
def sync_s3():
    if not S3_BUCKET:
        return jsonify({"error": "S3_BUCKET is not configured. Copy backend/.env.example to backend/.env and set S3_BUCKET."}), 400
    if not LOCAL_CSV.exists():
        return jsonify({"error": f"Local CSV not found: {LOCAL_CSV}"}), 404
    client = s3_client()
    try:
        client.upload_file(str(LOCAL_CSV), S3_BUCKET, S3_RAW_KEY)
        output_cmd = [HADOOP_CMD, "fs", "-cat", f"{HDFS_OUTPUT}/part-m-00000"]
        output = subprocess.run(output_cmd, capture_output=True, text=True, timeout=15, shell=False)
        result_uploaded = False
        if output.returncode == 0 and output.stdout.strip():
            client.put_object(Bucket=S3_BUCKET, Key=S3_RESULT_KEY, Body=output.stdout.encode("utf-8"), ContentType="text/plain; charset=utf-8")
            result_uploaded = True
        return jsonify({
            "ok": True,
            "message": f"Uploaded source CSV to s3://{S3_BUCKET}/{S3_RAW_KEY}" + (f" and Hadoop output to s3://{S3_BUCKET}/{S3_RESULT_KEY}." if result_uploaded else ". Hadoop output was not found, so only the CSV was uploaded."),
            "rawKey": S3_RAW_KEY,
            "resultUploaded": result_uploaded,
        })
    except (ClientError, BotoCoreError, OSError, subprocess.TimeoutExpired) as exc:
        return jsonify({"error": f"S3 sync failed: {exc}"}), 502


@app.post("/api/run-hadoop")
def run_hadoop():
    jar = Path(HADOOP_JAR)
    if not jar.exists():
        return jsonify({"error": f"Hadoop JAR not found: {jar}. Set HADOOP_JAR in backend/.env."}), 400
    # Remove only the configured output directory, then run the user's existing job.
    try:
        # Use argument lists with shell=False so Windows paths containing spaces
        # (for example, a user profile directory) are passed safely.
        subprocess.run(
            [HADOOP_CMD, "fs", "-rm", "-r", "-f", HDFS_OUTPUT],
            capture_output=True, text=True, timeout=30, shell=False
        )
        result = subprocess.run(
            [HADOOP_CMD, "jar", str(jar), HADOOP_MAIN_CLASS, HDFS_INPUT, HDFS_OUTPUT],
            capture_output=True, text=True, timeout=300, shell=False
        )
        if result.returncode != 0:
            return jsonify({"error": (result.stderr or result.stdout or "Hadoop job failed")[-2500:]}), 500
        return jsonify({"ok": True, "message": "Hadoop MapReduce job completed successfully.", "log": (result.stdout + "\n" + result.stderr)[-2500:]})
    except (OSError, subprocess.TimeoutExpired) as exc:
        return jsonify({"error": f"Could not run Hadoop job: {exc}"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("API_PORT", "5000")), debug=False)
