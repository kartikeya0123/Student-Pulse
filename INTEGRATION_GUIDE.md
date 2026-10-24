# StudentPulse: Hadoop + AWS S3 Integration

This project now includes a Flask API intended to connect the existing React dashboard to your local Hadoop setup and AWS S3. The integration is configurable; it does not contain AWS credentials and does not assume your S3 bucket exists.

## Architecture

React/Vite dashboard -> Flask API (`localhost:5000`) -> local CSV or configured S3 raw object; pipeline status reads the existing Hadoop HDFS output; S3 Sync uploads the CSV and (when present) the Hadoop output.

## 1. Configure the backend

Open PowerShell in the project folder (the folder containing `package.json`):

```powershell
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

Edit the values to match your machine. Based on the current setup discussed for this project, expected local paths are:

- CSV: `C:\Users\V SRI KARTIKEYA\student-performance\student_performance.csv`
- Hadoop home: `C:\hadoop\hadoop-3.3.6\hadoop-3.3.6`
- JAR: `C:\Users\V SRI KARTIKEYA\student-performance\AverageExam.jar`
- HDFS input: `/student/input/student_performance.csv`
- HDFS output: `/student/output/average`

If your paths differ, update them. Never put AWS access keys in this file; configure credentials with AWS CLI or an IAM role.

## 2. Install and start the API

Open PowerShell terminal 1:

```powershell
Set-Location "C:\path\to\project"
python -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python backend\app.py
```

Check `http://127.0.0.1:5000/api/health` in a browser. If the script says the CSV cannot be found, fix `STUDENT_CSV_PATH` in `backend/.env`.

## 3. Start the frontend

Open PowerShell terminal 2 in the same project folder:

```powershell
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The top bar has Refresh, Run Hadoop, and Sync S3 controls. If the API is unavailable, the frontend explicitly labels the current records as demo mode rather than pretending live data was loaded.

## 4. Connect AWS S3

1. Create an S3 bucket in your AWS account. Keep Block Public Access enabled.
2. Create an IAM identity with only the required access to that bucket (read/write objects and inspect the bucket as needed).
3. Configure AWS CLI credentials using `aws configure`, or use an IAM role where appropriate. Do not commit credentials.
4. Set `S3_BUCKET=your-actual-bucket-name` in `backend/.env`, and set the region.
5. Restart the Flask API.
6. Click **Sync S3** in the dashboard. This uploads the local CSV to `raw/student_performance.csv` and, if the configured HDFS output exists, uploads it to `results/average/part-m-00000`.

When the S3 raw object is readable, the API prefers it as the dashboard's data source; otherwise it falls back to the configured local CSV. The bucket and objects remain private unless you change their permissions.

## 5. Run Hadoop from the dashboard

Make sure Hadoop/HDFS is running and the input exists:

```powershell
& "$env:HADOOP_HOME\bin\hdfs.cmd" dfs -ls /student/input
& "$env:HADOOP_HOME\bin\hdfs.cmd" dfs -cat /student/output/average/part-m-00000
```

The dashboard's **Run Hadoop** button invokes the JAR and paths configured in `backend/.env`. The output directory is removed before a new run. Do not expose this local API to the public internet; it can launch a local process.

## Important current limitation

The existing `AverageExam.jar` described in the setup is a mapper-only single-split demonstration. It emits one average per input split and is not a correct global aggregation for multiple splits. Before claiming scalable analytics, implement a proper reducer-based average. The dashboard's charts are calculated from the source CSV; the Hadoop output average is shown separately as a pipeline result. This keeps the distinction between source-level visualizations and MapReduce output honest.

## Troubleshooting

- **Demo Mode / API unavailable:** start `python backend/app.py`; check port 5000 and `/api/health`.
- **CSV missing:** correct `STUDENT_CSV_PATH`.
- **Hadoop NOT_FOUND/UNAVAILABLE:** start HDFS, check `HADOOP_CMD`, and confirm the output path exists.
- **S3 access denied:** verify AWS CLI identity, bucket region, and IAM permissions. Never make the bucket public to fix credentials.
- **No live data:** inspect the Flask terminal for the reported API error and click Refresh after fixing it.
