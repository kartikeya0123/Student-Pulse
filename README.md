# 🎓 StudentPulse
### A Cloud-Integrated Big Data Intelligence Platform for Student Performance Analytics

<p align="center">

**Transforming Academic Data into Actionable Intelligence**

*Powered by Apache Hadoop • Java • HDFS • AWS S3 • Python • Streamlit*

</p>

---

## 📌 Project Overview

**StudentPulse** is a proposed cloud-integrated Big Data analytics platform designed to transform raw academic records into meaningful, interpretable, and actionable insights about student performance.

Academic institutions generate valuable data through attendance records, study-hour estimates, previous examination scores, assignment marks, and final examination results. However, these records are often maintained as disconnected spreadsheets or evaluated through basic statistical calculations. Such approaches can become inefficient when the volume of data increases, and they may provide limited support for identifying performance patterns or assisting academic decision-making.

StudentPulse aims to address this challenge by combining distributed data processing, cloud-based storage, structured analytical workflows, and interactive visualization.

The project begins with a Java-based Hadoop application that reads student records stored in Hadoop Distributed File System (HDFS) and calculates average examination marks. The next development stages aim to introduce scalable Mapper–Reducer analytics, Amazon Simple Storage Service (Amazon S3) integration, and a Streamlit dashboard.

The long-term objective is to establish a reproducible analytical pipeline that accepts academic datasets, processes them through a clearly defined workflow, stores input and output artifacts, and presents results through an accessible interface.

> **Core philosophy:** Academic data should not merely be stored or summarized. It should be processed systematically, interpreted responsibly, and presented in a form that supports better-informed educational decisions.

---

## ✨ Why StudentPulse?

StudentPulse is designed around a simple but important idea: the value of student data lies not only in collecting marks, but also in understanding patterns across academic indicators.

A student's examination result may be associated with several factors, including attendance, study hours, previous scores, and assignment performance. An analytical platform can examine these indicators together, summarize trends, and help educators investigate potential areas for improvement.

StudentPulse brings together four complementary capabilities:

- **Big Data processing:** Use Hadoop and Java to implement structured analytical jobs.
- **Distributed storage:** Organize input datasets and analytical outputs in HDFS.
- **Cloud integration:** Introduce Amazon S3 as a cloud storage layer for datasets and results.
- **Visual intelligence:** Build an interactive dashboard that makes analytical results easier to explore.

The platform is intended to evolve incrementally, allowing each component to be developed, tested, and demonstrated independently before integration.

---

## 🎯 Problem Statement

Educational datasets may contain hundreds, thousands, or millions of student records. Analyzing these records manually can be time-consuming, inconsistent, and difficult to reproduce.

Traditional spreadsheet-based workflows often emphasize individual scores or simple averages. They may not provide a repeatable process for processing larger datasets, storing multiple versions of analytical outputs, or exploring relationships between academic indicators.

The problem addressed by StudentPulse is:

**How can a scalable, reproducible, and cloud-integrated analytics pipeline process student performance data and convert it into understandable academic insights?**

The project investigates a solution using Hadoop-based data processing, HDFS storage, Amazon S3 integration, and an interactive dashboard.

### Challenges addressed

1. Repetitive manual calculations of examination statistics.
2. Limited scalability of purely manual analysis.
3. Separation between raw datasets and analytical results.
4. Difficulty comparing attendance, study hours, and examination performance.
5. Lack of a unified workflow for processing, storing, and visualizing results.
6. Need for reproducible processing steps and verifiable outputs.
7. Need to handle missing, malformed, or inconsistent records safely.
8. Need to protect student information and avoid unsupported conclusions.

---

## 💡 Proposed Solution

StudentPulse proposes a modular data analytics architecture with distinct responsibilities.

### 1. Data ingestion

Accept structured student records in CSV format. Validate the column structure and prepare the dataset for processing.

### 2. Storage

Use HDFS for the existing Hadoop workflow. Add Amazon S3 integration to maintain cloud copies of raw datasets, processed results, and selected reports.

### 3. Big Data processing

Develop Java-based Hadoop jobs for aggregate calculations, performance summaries, and other analytical tasks.

### 4. Result persistence

Write processed output into organized directories so that each job has a clear and reproducible result.

### 5. Dashboard and visualization

Build a Streamlit application that reads validated analytical results and displays statistics, charts, filters, and academic summaries.

### 6. Interpretation

Present descriptive findings with clear definitions and limitations. Where appropriate, identify records that may warrant additional academic attention without making definitive judgments about a student's ability or future.

---

## 🏗️ System Architecture

The planned end-to-end architecture is:

```text
                 STUDENT DATA SOURCES
                          |
                          v
              CSV DATASET / VALIDATION
                          |
                          v
                 AMAZON S3 (PLANNED)
                Raw dataset storage
                          |
                          v
                DATA INGESTION LAYER
                          |
                          v
                 HDFS INPUT DIRECTORY
                          |
                          v
                JAVA HADOOP JOBS
                          |
             +------------+------------+
             |                         |
             v                         v
        MAPPER TASKS              REDUCER TASKS
       Record-level work       Global aggregation
             |                         |
             +------------+------------+
                          |
                          v
                 PROCESSED OUTPUT
                          |
                +---------+---------+
                |                   |
                v                   v
             HDFS OUTPUT       AMAZON S3
                              (PLANNED)
                |                   |
                +---------+---------+
                          |
                          v
               STREAMLIT DASHBOARD
                     (PLANNED)
                          |
                          v
             VISUAL ANALYTICAL REPORTS
```

**Architecture note:** The current implementation uses HDFS input and a mapper-only Hadoop job. The complete S3-connected, reducer-based, dashboard-driven architecture is the intended development target.

---

## 🧰 Technology Stack

| Technology | Purpose | Development status |
|---|---|---|
| Java | Implement Hadoop processing logic | Implemented |
| Apache Hadoop 3.3.6 | Execute the current Hadoop job | Implemented |
| HDFS | Store the input CSV and output results | Implemented |
| Hadoop MapReduce API | Define the mapper and job workflow | Basic job implemented |
| Apache Hadoop LocalJobRunner | Execute the current job locally | Implemented |
| Amazon S3 | Cloud object storage | Planned |
| AWS CLI / AWS SDK | Transfer files to and from S3 | Planned |
| Python | Dashboard and supplementary analytics | Planned |
| Streamlit | Interactive dashboard | Planned |
| Pandas | Data inspection and visualization preparation | Planned |
| Plotly or Streamlit charts | Interactive charts | Planned |
| Git and GitHub | Version control and project documentation | Optional development tooling |

Additional components may be introduced if required by the project scope.

---

## 📂 Dataset Description

The current dataset is a synthetic student performance CSV containing 20 student records.

### Dataset schema

| Column | Description | Example |
|---|---|---|
| `StudentID` | Student record identifier | `S001` |
| `Attendance` | Attendance value recorded for the student | Dataset-specific value |
| `StudyHours` | Recorded study hours | Dataset-specific value |
| `PreviousScore` | Score from a previous assessment | Dataset-specific value |
| `AssignmentMarks` | Assignment marks | Dataset-specific value |
| `ExamMarks` | Final examination marks | Dataset-specific value |

The CSV header is:

```csv
StudentID,Attendance,StudyHours,PreviousScore,AssignmentMarks,ExamMarks
```

The current dataset contains the identifiers `S001` through `S020`.

### Data quality requirements

Before expanding the dataset, the project should implement validation for:

- Missing student identifiers.
- Duplicate student records.
- Missing numeric values.
- Invalid numeric formats.
- Marks outside the permitted assessment range.
- Attendance values outside the chosen scale.
- Negative or otherwise invalid study-hour values.
- Unexpected CSV columns.
- Header rows mistakenly treated as student records.

The permitted ranges should be explicitly documented according to the dataset definition rather than assumed for every institution.

### Dataset ethics

The current dataset is synthetic. It must not be presented as real institutional data.

If real academic records are introduced later, access control, consent or appropriate authorization, data minimization, secure storage, and institutional policies must be considered.

---

## ⚙️ Current Implementation

The first working milestone is a Java Hadoop application named `AverageExam`.

### Implemented functionality

- Hadoop 3.3.6 configured on Windows.
- Java compilation using the Hadoop classpath.
- Creation of a JAR file.
- Storage of the student dataset in HDFS.
- Execution through Hadoop's LocalJobRunner.
- Processing of a CSV input split.
- Skipping of the CSV header.
- Extraction of examination marks.
- Calculation of the mean examination mark within the mapper.
- Writing of a single result record into HDFS.

### Current output

```text
AverageExamMarks    74.5
```

The job processed 21 input lines: one header line and 20 student records. The mapper emitted one output record after completing the calculation.

### Verification

The output was retrieved successfully using:

```powershell
& "$env:HADOOP_HOME\bin\hdfs.cmd" dfs -cat /student/output/average/part-m-00000
```

The observed result was:

```text
AverageExamMarks        74.5
```

### Important implementation limitation

The current implementation uses:

```java
job.setNumReduceTasks(0);
```

The mapper accumulates a sum and count and writes their ratio during cleanup. This produces the correct result for the current single-input-split dataset.

However, if the CSV is divided across multiple mapper tasks, each mapper can emit a separate partial average. These averages cannot simply be combined to obtain the correct overall average unless the groups contain equal numbers of records.

Therefore, this implementation is a successful initial prototype, **not yet a general-purpose distributed average calculation**.

The next major engineering task is to implement a proper Mapper–Reducer workflow.

---

## 🧮 Analytical Modules — Planned

StudentPulse is intended to support multiple independent analytical jobs.

### Module 1: Average examination marks

Calculate the mean examination mark across valid student records.

\[
\text{Average}=\frac{\sum_{i=1}^{n}x_i}{n}
\]

Where:

- \(x_i\) represents the examination mark of a valid student record.
- \(n\) represents the number of valid records.

The result should be calculated using the total marks and count, not by averaging unrelated subgroup averages without weighting.

### Module 2: Highest and lowest marks

Identify the maximum and minimum examination marks in the valid dataset.

Potential outputs:

- Highest examination mark.
- Lowest examination mark.
- Associated student identifiers, subject to privacy requirements.
- Number of students sharing the same maximum or minimum.

### Module 3: Attendance analysis

Calculate attendance statistics and examine how attendance values vary across student records.

Potential outputs:

- Mean attendance.
- Attendance distribution.
- Counts within documented attendance bands.
- Comparison of attendance bands with average examination marks.

Any relationship found should be reported as an association, not proof that attendance alone caused an outcome.

### Module 4: Study-hour analysis

Summarize recorded study hours and compare them with examination results.

Potential outputs:

- Average recorded study hours.
- Distribution of study hours.
- Examination averages across study-hour bands.
- Comparison of study hours and marks.

These results depend on the accuracy and meaning of the original study-hour data.

### Module 5: Assignment analysis

Examine assignment performance alongside examination performance.

Potential outputs:

- Average assignment marks.
- Average examination marks.
- Difference between the two measures.
- Distribution of assignment results.

Marks from assessments with different scales should be normalized or clearly identified before comparison.

### Module 6: Student performance summaries

Create a summary record for each student using the available indicators.

A future output could contain:

```text
StudentID
Attendance
StudyHours
PreviousScore
AssignmentMarks
ExamMarks
PerformanceCategory
```

The precise schema should be finalized before implementation.

### Module 7: Performance categories

Optional categories may be defined using transparent, configurable score thresholds.

For example, the project could define categories such as:

- Excellent
- Good
- Satisfactory
- Needs academic support

The thresholds must be specified in the project documentation and approved for the chosen evaluation context. The labels should describe measured results rather than the student's overall ability.

### Module 8: Academic support indicators

A future analytical module could identify records that meet clearly documented criteria for additional review, such as low marks combined with low attendance.

These indicators should be treated as prompts for human review, not automated decisions about a student's future.

---

## 🔀 MapReduce Design

A scalable aggregation pipeline should separate record processing from global aggregation.

### Mapper responsibilities

1. Read an input record.
2. Skip the header.
3. Validate the record structure.
4. Parse the required numeric values.
5. Emit an intermediate key and value.

For an average calculation, a suitable intermediate representation is:

```text
Key: EXAM_AVERAGE
Value: (examMarks, 1)
```

For example:

```text
EXAM_AVERAGE    (85, 1)
EXAM_AVERAGE    (70, 1)
EXAM_AVERAGE    (75, 1)
```

### Reducer responsibilities

The reducer receives values grouped by key and computes:

\[
\text{Average}=\frac{\text{Total Marks}}{\text{Valid Record Count}}
\]

For the example above:

\[
\frac{85+70+75}{3}=76.67
\]

The reducer must combine all valid values associated with the key.

### Scalable implementation principle

For large datasets, a mapper can emit partial sums and counts. A reducer combines those totals and counts to compute the overall mean.

If multiple reducers are used, the design must ensure that all partial aggregates for the same global metric are combined correctly.

### Additional MapReduce jobs

The project may use separate jobs for:

- Maximum and minimum marks.
- Attendance-band summaries.
- Study-hour-band summaries.
- Student-level output generation.
- Data-quality reporting.

Each job should have a documented input schema, intermediate representation, output schema, and test cases.

---

## ☁️ Amazon S3 Integration — Planned

Amazon S3 is intended to provide cloud object storage for raw datasets, processed outputs, and project artifacts.

S3 is an object-storage service. It does not execute Java MapReduce jobs simply because a CSV is uploaded.

### Proposed S3 structure

The following is an example logical object layout, not an already-created bucket:

```text
s3://<your-bucket>/
│
├── raw/
│   └── student_performance.csv
│
├── processed/
│   ├── average/
│   ├── attendance/
│   ├── assignments/
│   └── performance/
│
├── reports/
│   ├── summaries/
│   └── exports/
│
└── metadata/
    ├── schema/
    └── run-history/
```

The actual bucket name and prefixes should be selected during setup.

### Planned S3 workflow

1. Create an S3 bucket in an appropriate AWS Region.
2. Configure least-privilege AWS access.
3. Upload the source CSV to the raw-data prefix.
4. Retrieve the CSV for the current Windows Hadoop workflow, or configure direct S3 access through a compatible Hadoop S3A setup.
5. Execute the analytical job.
6. Upload processed results to the appropriate S3 prefix.
7. Read validated output artifacts from S3 in the dashboard.
8. Record job metadata, including the dataset version and execution timestamp.

### Two possible integration strategies

**Strategy A — File transfer**

```text
S3 → Download CSV → HDFS → Hadoop Job → HDFS Output → Upload Output to S3
```

This is the simpler initial integration path.

**Strategy B — Direct S3A access**

```text
S3 Input → Hadoop S3A Filesystem → Hadoop Job → S3 Output
```

This requires a compatible Hadoop S3A connector, AWS authentication, network connectivity, and correct Hadoop configuration. It should be implemented only after the basic S3 file-transfer workflow is verified.

### AWS security requirements

- Do not commit AWS access keys or secret keys to GitHub.
- Prefer temporary credentials, IAM roles, or an appropriate local AWS credential provider.
- Grant only the S3 permissions required by the project.
- Keep the bucket private unless public access is explicitly required and appropriately reviewed.
- Avoid uploading real student records to an unrestricted public bucket.
- Monitor usage and remove unused resources.
- Check the AWS pricing and billing dashboard regularly.

---

## 📊 Interactive Dashboard — Planned

The dashboard is intended to be built with Python and Streamlit.

During development, it can run locally at:

```text
http://localhost:8501
```

Localhost means the dashboard is running on the developer's own computer. It is suitable for development, testing, and a demonstration on that machine.

A cloud-hosted version may be considered later if remote access is required.

### Proposed dashboard sections

#### 1. Overview

Display high-level indicators:

- Number of valid student records.
- Average examination marks.
- Highest examination mark.
- Lowest examination mark.
- Average attendance, where the data definition permits it.
- Average assignment marks.

#### 2. Examination performance

Potential visualizations:

- Histogram of examination marks.
- Bar chart of student examination marks.
- Summary statistics.
- Distribution by configured performance category.

#### 3. Attendance and marks

Potential visualizations:

- Scatter plot of attendance versus examination marks.
- Average examination marks by attendance band.
- Record counts by attendance band.

#### 4. Study hours and performance

Potential visualizations:

- Study-hour distribution.
- Scatter plot of study hours versus marks.
- Average marks by study-hour band.

#### 5. Assignment analysis

Potential visualizations:

- Assignment marks versus examination marks.
- Assessment summary statistics.
- Distribution of assignment results.

#### 6. Student record explorer

Potential features:

- Search by student identifier.
- Filter by attendance or performance range.
- View individual record details.
- Export authorized summaries.

Individual student information should be restricted to authorized users.

#### 7. Data quality and execution status

Potential features:

- Total rows read.
- Valid rows processed.
- Invalid rows rejected.
- Dataset filename and version.
- Job completion status.
- Output location.
- Last successful processing timestamp.

### Dashboard design principles

The dashboard should prioritize readability, meaningful labels, and honest interpretation.

Every chart should identify its measure and units. Filters should have predictable behavior, and calculations should be traceable to the processed dataset.

A chart that shows a correlation should not imply causation. A high score in one dataset should not be treated as a universal definition of student success.

---

## 🔄 End-to-End Workflow

The intended workflow is:

1. Prepare the student dataset.
2. Validate the CSV schema.
3. Upload the raw file to S3 when cloud integration is configured.
4. Copy or access the input through the selected Hadoop workflow.
5. Execute the required Java analytics job.
6. Validate the job status and counters.
7. Store the output in HDFS.
8. Upload the output to S3 when the cloud output step is implemented.
9. Load the processed results into the dashboard.
10. Review charts, summaries, and data-quality information.
11. Export the authorized report if required.
12. Document the results, limitations, and execution details.

Each stage should be testable independently.

---

## 📁 Proposed Repository Structure

The repository is intended to evolve toward the following layout:

```text
StudentPulse/
│
├── README.md
├── LICENSE
├── .gitignore
│
├── data/
│   ├── sample/
│   │   └── student_performance.csv
│   └── README.md
│
├── src/
│   └── main/
│       └── java/
│           └── AverageExam.java
│
├── dashboard/
│   ├── app.py
│   └── requirements.txt
│
├── scripts/
│   ├── upload_to_s3.ps1
│   ├── download_from_s3.ps1
│   └── run_analysis.ps1
│
├── config/
│   ├── schema.md
│   └── aws-setup.md
│
├── tests/
│   ├── test-cases.md
│   └── sample-expected-results.md
│
├── docs/
│   ├── architecture.md
│   ├── algorithm.md
│   ├── data-dictionary.md
│   ├── setup-guide.md
│   ├── aws-integration.md
│   ├── dashboard-guide.md
│   ├── limitations.md
│   └── viva-questions.md
│
└── reports/
    └── README.md
```

This is a proposed target structure. Not every directory or file listed above has been created yet. The existing source file and JAR currently reside in the local project folder used during development.

### Repository hygiene

Generated classes, compiled JARs, temporary Hadoop files, private credentials, and large datasets should not be committed unintentionally.

A future `.gitignore` should cover items such as:

```gitignore
*.class
*.log
__pycache__/
.venv/
venv/
.env
.aws/
classes/
target/
dist/
*.jar
```

The final rules should be reviewed before committing files. If the instructor requires a compiled JAR or sample dataset, provide a deliberately selected artifact rather than committing every generated file.

---

## 🖥️ Development Environment

The current environment uses Windows PowerShell.

### Current configuration

| Component | Value |
|---|---|
| Operating system | Windows |
| Hadoop version | 3.3.6 |
| Java version | Java 11 |
| Hadoop home | `C:\hadoop\hadoop-3.3.6\hadoop-3.3.6` |
| Java home | `C:\Java11` |
| Local working directory | `%USERPROFILE%\student-performance` |
| HDFS input | `/student/input/student_performance.csv` |
| HDFS output | `/student/output/average` |
| Current output file | `part-m-00000` |

These paths describe the current development setup and may need adjustment on another machine.

### Verify Hadoop

```powershell
& "$env:HADOOP_HOME\bin\hadoop.cmd" version
```

### Verify the HDFS input

```powershell
& "$env:HADOOP_HOME\bin\hdfs.cmd" dfs -ls /student/input
```

### Inspect the current output

```powershell
& "$env:HADOOP_HOME\bin\hdfs.cmd" dfs -cat /student/output/average/part-m-00000
```

Expected output for the current dataset:

```text
AverageExamMarks    74.5
```

### Compile the current Java program

From the project directory:

```powershell
Set-Location "$HOME\student-performance"

$cp = & "$env:HADOOP_HOME\bin\hadoop.cmd" classpath

New-Item -ItemType Directory -Force .\classes | Out-Null

javac -cp "$cp" -d .\classes .\src\AverageExam.java

jar -cf .\AverageExam.jar -C .\classes .
```

These commands rebuild the current program. The current implementation is mapper-only; the reducer-based version will require an updated source file and corresponding tests.

### Run the current job

```powershell
& "$env:HADOOP_HOME\bin\hadoop.cmd" jar "$HOME\student-performance\AverageExam.jar" AverageExam /student/input/student_performance.csv /student/output/average
```

The destination must not already exist when Hadoop writes a new output. Remove only the previous output directory when intentionally rerunning the job.

---

## 🧪 Testing Strategy

StudentPulse should be tested at the data, algorithm, integration, and presentation layers.

### Data validation tests

- Correct CSV header.
- Empty dataset.
- Header-only dataset.
- Missing required fields.
- Invalid examination marks.
- Duplicate identifiers.
- Extra columns.
- Incorrect delimiters.
- Invalid numeric values.

### Analytical tests

- Correct average for a known dataset.
- Correct handling of invalid records.
- Correct count of valid students.
- Correct maximum and minimum values.
- Correct aggregation across multiple input splits.
- Correct treatment of empty input.
- Correct handling of ties in rankings.

### Hadoop tests

- Job compiles against the configured Hadoop classpath.
- HDFS input exists.
- Output directory is created after successful completion.
- Job counters match the expected dataset.
- Output is readable from HDFS.
- Reducer-based processing works when multiple splits are used.

### AWS integration tests

Once S3 integration is implemented:

- Upload a sample input object.
- Verify that the expected object exists.
- Download the object and compare its contents.
- Execute the analytical job.
- Upload the result to the designated output prefix.
- Verify that the uploaded output matches the HDFS result.
- Test behavior when credentials are missing or permissions are insufficient.

### Dashboard tests

Once the dashboard is implemented:

- Verify that the expected output file is loaded.
- Check KPI calculations against independently calculated results.
- Check chart data and filters.
- Test empty and malformed inputs.
- Confirm that invalid records are handled transparently.
- Confirm that sensitive records are not exposed to unauthorized users.

---

## 📈 Evaluation Metrics

The project should be evaluated using measurable criteria rather than visual appearance alone.

### Functional correctness

- Accuracy of statistical calculations.
- Correctness of data validation.
- Correct handling of empty and malformed inputs.
- Agreement between expected and actual output.

### Processing performance

- Execution time.
- Number of records processed.
- Input and output sizes.
- Behavior as dataset size increases.

### Scalability

- Correct aggregation across multiple input splits.
- Consistency of results across different dataset sizes.
- Resource usage where measurable.

### Cloud integration

- Successful input transfer.
- Successful result upload.
- Correct permissions.
- Reproducibility of the cloud workflow.

### Usability

- Clarity of charts and labels.
- Ease of exploring results.
- Visibility of data-quality issues.
- Ease of reproducing an analysis.

No performance benchmark or speedup claim should be published until it has been measured under documented conditions.

---

## 🔐 Security, Privacy, and Responsible Analytics

StudentPulse concerns educational information, which can be sensitive when linked to identifiable individuals.

The project should follow these principles:

1. Use synthetic or appropriately authorized data.
2. Do not commit credentials or private configuration to version control.
3. Keep cloud storage private by default.
4. Grant only necessary permissions.
5. Avoid displaying individual student records to unauthorized viewers.
6. Avoid treating statistical patterns as proof of causation.
7. Document missing values and data-quality limitations.
8. Use transparent and configurable performance thresholds.
9. Keep human educators involved in consequential academic decisions.
10. Do not use the dashboard to label students permanently or infer personal characteristics unrelated to the data.

Academic analytics should support investigation and assistance, not replace contextual understanding or professional judgment.

---

## ⚠️ Current Limitations

The present prototype has several limitations that must be addressed before the full project can be considered complete.

### 1. Small synthetic dataset

The current input contains 20 student records. It demonstrates basic processing but does not establish scalability or represent real institutional populations.

### 2. Mapper-only average

The current job uses one mapper output record and no reducer. Its global average is correct for the present single-split dataset, but it is not a general solution for multiple independent mapper splits.

### 3. AWS S3 is not yet integrated

The project has not yet established a verified S3 bucket, configured cloud credentials, or demonstrated a successful S3-to-HDFS processing workflow.

### 4. Dashboard is not yet implemented

The Streamlit interface, charts, filters, and reporting features remain planned work.

### 5. Limited analytical scope

The current implementation calculates only the average examination marks. Additional analytics require new jobs and validation.

### 6. Local execution

The current job runs using Hadoop's LocalJobRunner. It demonstrates Hadoop APIs and HDFS access but does not establish execution across a multi-node Hadoop cluster.

### 7. Limited predictive capability

The current system is descriptive. It does not contain a trained predictive model, a validated risk model, or evidence that it can predict future academic outcomes.

These limitations form the basis of the development roadmap rather than reasons to overstate the current prototype.

---

## 🚀 Development Roadmap

### Phase 1 — Working Hadoop prototype

**Status: Completed**

- Configure Hadoop and Java on Windows.
- Prepare the synthetic CSV dataset.
- Upload the dataset to HDFS.
- Compile and package the Java program.
- Execute the mapper-only average calculation.
- Verify the output value of `74.5`.

### Phase 2 — General-purpose MapReduce

**Status: Planned**

- Implement a mapper that emits sums and counts.
- Implement a reducer that combines those values.
- Verify the calculation with known expected results.
- Test with multiple input splits.
- Add input validation and error handling.
- Document the intermediate key-value format.

### Phase 3 — Expanded analytics

**Status: Planned**

- Implement minimum and maximum calculations.
- Calculate attendance and assignment summaries.
- Add student-level output where appropriate.
- Define performance categories.
- Test each analytical module independently.

### Phase 4 — AWS S3 integration

**Status: Planned**

- Create a private S3 bucket.
- Configure credentials and permissions safely.
- Upload the source dataset.
- Implement the transfer workflow.
- Upload processed outputs.
- Verify the integrity of input and output artifacts.

### Phase 5 — Dashboard development

**Status: Planned**

- Build the Streamlit application.
- Add KPI cards and charts.
- Implement filters and record exploration.
- Add dataset and job-status information.
- Validate dashboard metrics against known results.

### Phase 6 — Integration and testing

**Status: Planned**

- Connect S3, Hadoop, and the dashboard.
- Run an end-to-end workflow.
- Add failure handling and logging.
- Test larger synthetic datasets.
- Document the execution process.

### Phase 7 — Final demonstration and documentation

**Status: Planned**

- Prepare the architecture diagram.
- Record verified experimental results.
- Complete the project report.
- Prepare the presentation and viva questions.
- Demonstrate the complete workflow.
- Document limitations and future enhancements.

---

## 🔮 Future Scope

After the core platform is stable, StudentPulse could be extended in several directions.

### 1. Larger-scale datasets

Test datasets with more records and more complex input distributions. Compare execution time and resource use under clearly documented conditions.

### 2. Cloud-native processing

Investigate AWS-managed data processing services if they fit the academic requirements and available budget.

### 3. Historical trend analysis

Analyze multiple assessment periods to identify changes in performance over time, provided comparable and appropriately authorized records are available.

### 4. Predictive modeling

Explore whether historical academic indicators can support a carefully validated prediction task. Such a model would require an appropriate dataset, a defined target, train/test separation, suitable evaluation metrics, and bias analysis.

### 5. Explainable analytical results

Provide clear explanations of the statistics and rules used to generate each dashboard indicator.

### 6. Report generation

Generate downloadable summaries with dataset metadata, execution timestamps, and clearly defined calculations.

### 7. Role-based access

Separate administrator, educator, and viewer permissions if the platform is extended for real institutional use.

### 8. Automated processing

Introduce a scheduled or event-driven workflow only after the manual pipeline is reliable, observable, and secure.

---

## 🎓 Academic Significance

StudentPulse provides an opportunity to explore the practical relationship between Big Data technologies and educational analytics.

The project demonstrates how a structured dataset can be processed through a Java Hadoop application, stored in HDFS, and analyzed using a reproducible workflow. Planned extensions introduce cloud storage and interactive visualization, creating opportunities to study data movement, aggregation, integration, and presentation.

Its educational value includes:

- Understanding Hadoop configuration and job execution.
- Applying Java to data-processing tasks.
- Working with HDFS commands and file organization.
- Learning the roles of mappers and reducers.
- Understanding the difference between local execution and distributed processing.
- Integrating object storage with a data-processing pipeline.
- Designing meaningful data visualizations.
- Evaluating statistical outputs against known results.
- Practicing secure and responsible handling of educational data.

The project is intentionally modular so that each layer can be evaluated and improved independently.

---

## 📚 Key Concepts

| Concept | Meaning in StudentPulse |
|---|---|
| Big Data analytics | Systematic analysis of structured datasets |
| Hadoop | Framework used for the current Java data-processing workflow |
| HDFS | Distributed file system used to store the current input and output |
| Mapper | Processes input records and emits intermediate data |
| Reducer | Combines intermediate data to produce aggregated results |
| LocalJobRunner | Executes a Hadoop MapReduce job locally |
| Amazon S3 | Planned cloud object-storage layer |
| Streamlit | Planned Python framework for the interactive dashboard |
| Data validation | Checking records for structural and value correctness |
| Data visualization | Presenting analytical results through charts and summaries |
| Reproducibility | Ability to repeat an analysis and verify its output |

---

## 📝 Project Deliverables

The intended final submission may include:

- [ ] Working Java source code.
- [x] Initial Hadoop average-analysis prototype.
- [x] Verified HDFS output for the current dataset.
- [ ] General-purpose Mapper–Reducer implementation.
- [ ] Additional analytical jobs.
- [ ] AWS S3 setup and integration scripts.
- [ ] Streamlit dashboard.
- [ ] Data validation and test cases.
- [ ] Architecture and workflow diagrams.
- [ ] Screenshots of verified execution results.
- [ ] Technical report.
- [ ] Presentation slides.
- [ ] Viva questions and answers.
- [ ] Deployment and reproduction instructions.

The checklist distinguishes the existing prototype from the remaining project deliverables.

---

## 🤝 Contributing

Contributions are welcome once the repository is published.

Potential areas for contribution include:

- Improving CSV validation.
- Implementing reducer-based aggregation.
- Adding analytical modules.
- Improving dashboard usability.
- Adding automated tests.
- Documenting AWS setup.
- Improving reproducibility and error handling.

Suggested contribution workflow:

1. Fork the repository.
2. Create a feature branch.
3. Implement a focused change.
4. Test the change using documented input data.
5. Update relevant documentation.
6. Submit a pull request describing the change and test results.

Contributions should not include real student records, private credentials, or unverified performance claims.

---

## 📜 License

A license has not yet been selected for this project.

Before publishing the repository as open source, choose a license that reflects the intended usage and any institutional requirements. Do not assume that the absence of a license grants permission to reuse the code.

---

## 👨‍💻 Project Information

**Project name:** StudentPulse

**Full title:** StudentPulse — A Cloud-Integrated Big Data Intelligence Platform for Student Performance Analytics

**Project category:** Big Data Analytics / Educational Data Analytics

**Primary implementation language:** Java

**Current processing framework:** Apache Hadoop 3.3.6

**Current storage layer:** HDFS

**Planned cloud storage:** Amazon S3

**Planned dashboard:** Python and Streamlit

**Current execution environment:** Windows with Java 11 and Hadoop LocalJobRunner

**Current milestone:** Successful average examination marks calculation on a synthetic dataset

**Current verified result:** `AverageExamMarks = 74.5`

**Intended audience:** Students, educators, academic project evaluators, and developers interested in Big Data analytics.

---

## 🌟 Final Note

StudentPulse begins with a simple question: *What can academic data tell us when it is processed systematically rather than viewed as isolated rows in a spreadsheet?*

The initial prototype demonstrates a working Hadoop-based calculation. The next stages aim to transform that calculation into a scalable analytical workflow, connect it to cloud storage, and make its results accessible through an interactive dashboard.

The project's success should ultimately be measured by the correctness of its analysis, the reliability of its workflow, the clarity of its visualizations, and the transparency of its limitations—not by the number of technologies listed in its stack.

**StudentPulse — From Student Records to Academic Insights.**

