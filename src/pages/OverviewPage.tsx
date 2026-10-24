import { TrendingUp, Sparkles, Database, Cpu } from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { DonutChart, LineChart, SectionHeader, ProgressRing } from '@/components/charts/Charts';
import { getKpis, getPerformanceDistribution, getExamHistogram, getAttendanceBands, students } from '@/data/students';

export function OverviewPage() {
  const kpis = getKpis();
  const dist = getPerformanceDistribution();
  const histogram = getExamHistogram();
  const attendanceBands = getAttendanceBands();

  // Simulated trend across exam mark bins (cumulative avg)
  const trendData = histogram.map((h, i) => ({
    label: h.range,
    value: students.slice(0, (i + 1) * 30).reduce((a, s) => a + s.ExamMarks, 0) / ((i + 1) * 30 || 1),
  }));

  const accentKeys = ['cyan', 'emerald', 'amber', 'blue', 'violet', 'rose', 'teal', 'orange'];
  const passRate = (students.filter((s) => s.ExamMarks >= 50).length / students.length) * 100;
  const excellentRate = (students.filter((s) => s.ExamMarks >= 85).length / students.length) * 100;

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <GlassCard className="p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-cyan-300" />
              <span className="text-xs font-medium text-cyan-300 uppercase tracking-wider">Big Data Intelligence</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Academic Performance Dashboard</h2>
            <p className="text-sm text-white/50 mt-1 max-w-lg">
              Powered by Apache Hadoop &amp; HDFS — transforming 200 student records into actionable insights through distributed MapReduce analytics.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Database size={16} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/40">Storage</p>
                <p className="text-sm font-semibold text-white">HDFS / S3</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Cpu size={16} className="text-emerald-300" />
              <div>
                <p className="text-xs text-white/40">Engine</p>
                <p className="text-sm font-semibold text-white">MapReduce</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} accent={accentKeys[i % accentKeys.length]} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeader
            title="Exam Mark Distribution"
            subtitle="Histogram of examination scores across all students"
            icon={<TrendingUp size={20} />}
          />
          <LineChart data={trendData} height={260} color="#22d3ee" />
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader
            title="Performance Categories"
            subtitle="Students by performance tier"
          />
          <DonutChart data={dist} size={200} />
        </GlassCard>
      </div>

      {/* Progress rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6 flex flex-col items-center">
          <ProgressRing value={passRate} max={100} label="Pass Rate" color="#10b981" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center">
          <ProgressRing value={excellentRate} max={100} label="Excellence Rate" color="#22d3ee" suffix="%" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center">
          <ProgressRing
            value={attendanceBands[0].count + attendanceBands[1].count}
            max={students.length}
            label="Good Attendance"
            color="#f59e0b"
            suffix=""
          />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col items-center">
          <ProgressRing
            value={students.filter((s) => s.StudyHours >= 5).length}
            max={students.length}
            label="Active Studiers"
            color="#8b5cf6"
            suffix=""
          />
        </GlassCard>
      </div>
    </div>
  );
}
