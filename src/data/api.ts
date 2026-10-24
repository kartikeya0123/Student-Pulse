import type { StudentRecord, PipelineMetadata } from './students';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export async function fetchLiveData(): Promise<{ students: StudentRecord[]; pipeline: PipelineMetadata }> {
  const [studentsResponse, pipelineResponse] = await Promise.all([
    fetch(`${API_BASE}/api/students`),
    fetch(`${API_BASE}/api/pipeline`),
  ]);
  if (!studentsResponse.ok) throw new Error(`Students API returned ${studentsResponse.status}`);
  if (!pipelineResponse.ok) throw new Error(`Pipeline API returned ${pipelineResponse.status}`);
  const studentPayload = await studentsResponse.json();
  const pipelinePayload = await pipelineResponse.json();
  return { students: studentPayload.students, pipeline: pipelinePayload };
}

export async function syncToS3() {
  const response = await fetch(`${API_BASE}/api/sync-s3`, { method: 'POST' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `S3 sync failed (${response.status})`);
  return payload;
}

export async function runHadoopJob() {
  const response = await fetch(`${API_BASE}/api/run-hadoop`, { method: 'POST' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Hadoop job failed (${response.status})`);
  return payload;
}
