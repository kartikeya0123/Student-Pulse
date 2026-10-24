import { useCallback, useEffect, useState } from 'react';
import { Bell, Search, Settings, RefreshCw, CloudUpload, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { Sidebar, type PageId } from '@/components/layout/Sidebar';
import { OverviewPage } from '@/pages/OverviewPage';
import { ExamPage } from '@/pages/ExamPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { StudyPage } from '@/pages/StudyPage';
import { ExplorerPage } from '@/pages/ExplorerPage';
import { QualityPage } from '@/pages/QualityPage';
import { fetchLiveData, syncToS3, runHadoopJob } from '@/data/api';
import { setLiveStudents, setPipelineMetadata } from '@/data/students';

const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Real-time academic performance intelligence' },
  exam: { title: 'Exam Performance', subtitle: 'Distribution, rankings & support indicators' },
  attendance: { title: 'Attendance Analysis', subtitle: 'Attendance patterns and their relationship to marks' },
  study: { title: 'Study Hours Analysis', subtitle: 'Study-time patterns and exam outcomes' },
  explorer: { title: 'Student Explorer', subtitle: 'Search, filter and inspect individual records' },
  quality: { title: 'Data Quality & Pipeline', subtitle: 'Validation, execution status & architecture' },
};

function App() {
  const [page, setPage] = useState<PageId>('overview');
  const [connection, setConnection] = useState<'loading' | 'connected' | 'demo' | 'error'>('loading');
  const [notice, setNotice] = useState('Connecting to StudentPulse API…');
  const [busy, setBusy] = useState(false);

  const refreshData = useCallback(async () => {
    setBusy(true);
    try {
      const data = await fetchLiveData();
      if (!Array.isArray(data.students) || data.students.length === 0) {
        throw new Error('The API returned no student records. Check the CSV path or S3 object.');
      }
      setLiveStudents(data.students);
      setPipelineMetadata(data.pipeline);
      setConnection('connected');
      setNotice(`Live data loaded: ${data.students.length} students · ${data.pipeline.source}`);
    } catch (error) {
      setConnection('demo');
      setNotice(`API unavailable; displaying demo records. ${error instanceof Error ? error.message : ''}`);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { void refreshData(); }, [refreshData]);

  const handleS3Sync = async () => {
    setBusy(true);
    try {
      const result = await syncToS3();
      setNotice(result.message || 'S3 sync completed.');
      await refreshData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'S3 sync failed.');
    } finally { setBusy(false); }
  };

  const handleHadoopRun = async () => {
    setBusy(true);
    try {
      const result = await runHadoopJob();
      setNotice(result.message || 'Hadoop job completed.');
      await refreshData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Hadoop job failed.');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      <Sidebar active={page} onNavigate={setPage} />

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-white tracking-tight">{pageTitles[page].title}</h1>
              <p className="text-xs text-white/40">{pageTitles[page].subtitle}</p>
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              <span className={`hidden xl:inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${connection === 'connected' ? 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10' : connection === 'demo' ? 'text-amber-300 border-amber-400/20 bg-amber-400/10' : 'text-cyan-300 border-cyan-400/20 bg-cyan-400/10'}`} title={notice}>
                {connection === 'connected' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {connection === 'connected' ? 'API Connected' : connection === 'demo' ? 'Demo Mode' : 'Connecting'}
              </span>
              <button onClick={() => void refreshData()} disabled={busy} title="Refresh live data" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white disabled:opacity-50 text-sm">
                <RefreshCw size={15} className={busy ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Refresh</span>
              </button>
              <button onClick={() => void handleHadoopRun()} disabled={busy} title="Run configured Hadoop job" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50 text-sm">
                <Cpu size={15} /> Run Hadoop
              </button>
              <button onClick={() => void handleS3Sync()} disabled={busy} title="Upload source data and Hadoop output to S3" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50 text-sm">
                <CloudUpload size={15} /> Sync S3
              </button>
              <div className="hidden">{notice}</div>
              <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 transition-all w-56"
                />
              </div>

              <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
              </button>

              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Settings size={18} />
              </button>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">
                SP
              </div>
            </div>
          </div>
        </header>

        {connection !== 'connected' && (
          <div className={`mx-5 mt-4 px-4 py-3 rounded-xl border text-xs ${connection === 'demo' ? 'bg-amber-500/10 border-amber-400/20 text-amber-200' : 'bg-cyan-500/10 border-cyan-400/20 text-cyan-200'}`} role="status">
            {notice}
          </div>
        )}
        {/* Page content */}
        <main className="p-5 pb-24 lg:pb-8">
          {page === 'overview' && <OverviewPage />}
          {page === 'exam' && <ExamPage />}
          {page === 'attendance' && <AttendancePage />}
          {page === 'study' && <StudyPage />}
          {page === 'explorer' && <ExplorerPage />}
          {page === 'quality' && <QualityPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
