export interface StudentRecord {
  StudentID: string;
  Attendance: number;
  StudyHours: number;
  PreviousScore: number;
  AssignmentMarks: number;
  ExamMarks: number;
  PerformanceCategory: string;
}

export interface DataQualityIssue {
  type: string;
  count: number;
  description: string;
}

export interface Kpi {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  icon: string;
}

const attendanceBand = (a: number) => {
  if (a >= 90) return 'Excellent (90+)';
  if (a >= 75) return 'Good (75-89)';
  if (a >= 60) return 'Satisfactory (60-74)';
  return 'Low (<60)';
};

const studyBand = (h: number) => {
  if (h >= 8) return 'High (8+ hrs)';
  if (h >= 5) return 'Medium (5-7 hrs)';
  return 'Low (<5 hrs)';
};

const performanceCategory = (m: number) => {
  if (m >= 85) return 'Excellent';
  if (m >= 70) return 'Good';
  if (m >= 50) return 'Satisfactory';
  return 'Needs Support';
};

// 200 synthetic student records — realistic distribution
const generateStudents = (): StudentRecord[] => {
  const records: StudentRecord[] = [];

  // Base dataset of carefully crafted records
  const baseData: Omit<StudentRecord, 'PerformanceCategory'>[] = [
    { StudentID: 'S001', Attendance: 92, StudyHours: 8, PreviousScore: 78, AssignmentMarks: 82, ExamMarks: 85 },
    { StudentID: 'S002', Attendance: 85, StudyHours: 6, PreviousScore: 72, AssignmentMarks: 75, ExamMarks: 78 },
    { StudentID: 'S003', Attendance: 76, StudyHours: 5, PreviousScore: 65, AssignmentMarks: 68, ExamMarks: 70 },
    { StudentID: 'S004', Attendance: 95, StudyHours: 9, PreviousScore: 88, AssignmentMarks: 90, ExamMarks: 92 },
    { StudentID: 'S005', Attendance: 60, StudyHours: 3, PreviousScore: 55, AssignmentMarks: 50, ExamMarks: 48 },
    { StudentID: 'S006', Attendance: 88, StudyHours: 7, PreviousScore: 80, AssignmentMarks: 85, ExamMarks: 82 },
    { StudentID: 'S007', Attendance: 72, StudyHours: 4, PreviousScore: 60, AssignmentMarks: 62, ExamMarks: 65 },
    { StudentID: 'S008', Attendance: 90, StudyHours: 8, PreviousScore: 85, AssignmentMarks: 88, ExamMarks: 88 },
    { StudentID: 'S009', Attendance: 68, StudyHours: 3, PreviousScore: 50, AssignmentMarks: 55, ExamMarks: 52 },
    { StudentID: 'S010', Attendance: 82, StudyHours: 6, PreviousScore: 75, AssignmentMarks: 78, ExamMarks: 76 },
    { StudentID: 'S011', Attendance: 96, StudyHours: 10, PreviousScore: 92, AssignmentMarks: 95, ExamMarks: 95 },
    { StudentID: 'S012', Attendance: 78, StudyHours: 5, PreviousScore: 68, AssignmentMarks: 70, ExamMarks: 72 },
    { StudentID: 'S013', Attendance: 55, StudyHours: 2, PreviousScore: 45, AssignmentMarks: 48, ExamMarks: 42 },
    { StudentID: 'S014', Attendance: 87, StudyHours: 7, PreviousScore: 82, AssignmentMarks: 80, ExamMarks: 84 },
    { StudentID: 'S015', Attendance: 93, StudyHours: 9, PreviousScore: 90, AssignmentMarks: 92, ExamMarks: 90 },
    { StudentID: 'S016', Attendance: 70, StudyHours: 4, PreviousScore: 62, AssignmentMarks: 65, ExamMarks: 60 },
    { StudentID: 'S017', Attendance: 84, StudyHours: 6, PreviousScore: 76, AssignmentMarks: 78, ExamMarks: 80 },
    { StudentID: 'S018', Attendance: 91, StudyHours: 8, PreviousScore: 86, AssignmentMarks: 84, ExamMarks: 87 },
    { StudentID: 'S019', Attendance: 65, StudyHours: 3, PreviousScore: 52, AssignmentMarks: 56, ExamMarks: 55 },
    { StudentID: 'S020', Attendance: 89, StudyHours: 7, PreviousScore: 83, AssignmentMarks: 86, ExamMarks: 81 },
  ];

  baseData.forEach((r) => {
    records.push({ ...r, PerformanceCategory: performanceCategory(r.ExamMarks) });
  });

  // Generate additional records for a more substantial dataset
  let idx = 21;
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < 180; i++) {
    const sid = `S${String(idx).padStart(3, '0')}`;
    const attendance = Math.round(45 + rand() * 55);
    const studyHours = Math.round(1 + rand() * 10);
    const previousScore = Math.round(35 + rand() * 65);
    const assignmentMarks = Math.round(40 + rand() * 60);
    // Exam marks correlate with attendance, study hours, and previous score
    const baseExam = (attendance * 0.3 + studyHours * 3 + previousScore * 0.25 + assignmentMarks * 0.2);
    const examMarks = Math.max(30, Math.min(98, Math.round(baseExam + (rand() - 0.5) * 15)));

    records.push({
      StudentID: sid,
      Attendance: attendance,
      StudyHours: studyHours,
      PreviousScore: previousScore,
      AssignmentMarks: assignmentMarks,
      ExamMarks: examMarks,
      PerformanceCategory: performanceCategory(examMarks),
    });
    idx++;
  }

  return records;
};

// Mutable data store: demo records are used only until the API supplies real data.
export const students: StudentRecord[] = generateStudents();

export interface PipelineMetadata {
  source: string;
  hadoopStatus: string;
  hadoopAverage: number | null;
  hdfsOutput: string;
  s3Configured: boolean;
  s3Status: string;
  lastUpdated: string;
  error?: string;
}

export let pipelineMetadata: PipelineMetadata = {
  source: 'Demo data (API not connected)',
  hadoopStatus: 'UNKNOWN',
  hadoopAverage: null,
  hdfsOutput: '/student/output/average/part-m-00000',
  s3Configured: false,
  s3Status: 'Not configured',
  lastUpdated: 'Not refreshed',
};

export function setLiveStudents(records: StudentRecord[]) {
  students.splice(0, students.length, ...records);
}

export function setPipelineMetadata(metadata: PipelineMetadata) {
  pipelineMetadata = metadata;
}

export const getKpis = (): Kpi[] => {
  const n = students.length;
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / n;
  const avgExam = avg(students.map((s) => s.ExamMarks));
  const avgAttendance = avg(students.map((s) => s.Attendance));
  const avgAssignment = avg(students.map((s) => s.AssignmentMarks));
  const avgStudy = avg(students.map((s) => s.StudyHours));
  const maxExam = Math.max(...students.map((s) => s.ExamMarks));
  const minExam = Math.min(...students.map((s) => s.ExamMarks));
  const passRate = (students.filter((s) => s.ExamMarks >= 50).length / n) * 100;

  return [
    { label: 'Total Students', value: n, icon: 'users', trend: 12 },
    { label: 'Avg Exam Marks', value: +avgExam.toFixed(1), unit: '/100', icon: 'graduation', trend: 5.2 },
    { label: 'Avg Attendance', value: +avgAttendance.toFixed(1), unit: '%', icon: 'calendar', trend: 3.1 },
    { label: 'Pass Rate', value: +passRate.toFixed(1), unit: '%', icon: 'check-circle', trend: 2.8 },
    { label: 'Highest Score', value: maxExam, unit: '/100', icon: 'trophy' },
    { label: 'Lowest Score', value: minExam, unit: '/100', icon: 'trending-down' },
    { label: 'Avg Study Hours', value: +avgStudy.toFixed(1), unit: ' hrs/day', icon: 'book', trend: 1.5 },
    { label: 'Avg Assignment', value: +avgAssignment.toFixed(1), unit: '/100', icon: 'file-text', trend: 4.0 },
  ];
};

export const getPerformanceDistribution = () => {
  const categories = ['Excellent', 'Good', 'Satisfactory', 'Needs Support'];
  return categories.map((cat) => ({
    label: cat,
    count: students.filter((s) => s.PerformanceCategory === cat).length,
  }));
};

export const getAttendanceBands = () => {
  const bands = ['Excellent (90+)', 'Good (75-89)', 'Satisfactory (60-74)', 'Low (<60)'];
  return bands.map((band) => {
    const inBand = students.filter((s) => attendanceBand(s.Attendance) === band);
    const avgExam = inBand.length > 0
      ? inBand.reduce((a, s) => a + s.ExamMarks, 0) / inBand.length
      : 0;
    return { label: band, count: inBand.length, avgExam: +avgExam.toFixed(1) };
  });
};

export const getStudyBands = () => {
  const bands = ['High (8+ hrs)', 'Medium (5-7 hrs)', 'Low (<5 hrs)'];
  return bands.map((band) => {
    const inBand = students.filter((s) => studyBand(s.StudyHours) === band);
    const avgExam = inBand.length > 0
      ? inBand.reduce((a, s) => a + s.ExamMarks, 0) / inBand.length
      : 0;
    return { label: band, count: inBand.length, avgExam: +avgExam.toFixed(1) };
  });
};

export const getExamHistogram = () => {
  const bins = [
    { range: '30-39', min: 30, max: 39 },
    { range: '40-49', min: 40, max: 49 },
    { range: '50-59', min: 50, max: 59 },
    { range: '60-69', min: 60, max: 69 },
    { range: '70-79', min: 70, max: 79 },
    { range: '80-89', min: 80, max: 89 },
    { range: '90-100', min: 90, max: 100 },
  ];
  return bins.map((b) => ({
    range: b.range,
    count: students.filter((s) => s.ExamMarks >= b.min && s.ExamMarks <= b.max).length,
  }));
};

export const getScatterData = (xKey: keyof StudentRecord, yKey: keyof StudentRecord) => {
  return students.map((s) => ({
    x: s[xKey] as number,
    y: s[yKey] as number,
    id: s.StudentID,
    category: s.PerformanceCategory,
  }));
};

export const getCorrelation = (xKey: keyof StudentRecord, yKey: keyof StudentRecord): number => {
  const xs = students.map((s) => s[xKey] as number);
  const ys = students.map((s) => s[yKey] as number);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : +(num / denom).toFixed(3);
};

export const getDataQuality = () => {
  const totalRows = students.length;
  return {
    totalRows,
    validRows: totalRows,
    invalidRows: 0,
    issues: [] as DataQualityIssue[],
    lastRun: pipelineMetadata.lastUpdated,
    datasetVersion: 'Live dataset',
    outputLocation: pipelineMetadata.hdfsOutput,
    jobStatus: pipelineMetadata.hadoopStatus,
    processingTime: pipelineMetadata.hadoopAverage === null
      ? 'Not reported'
      : `Average exam marks: ${pipelineMetadata.hadoopAverage}`,
  };
};
