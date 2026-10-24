import { GraduationCap, BarChart3, PieChart, Award, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Histogram, DonutChart, BarChart, SectionHeader, StatPill } from '@/components/charts/Charts';
import { getExamHistogram, getPerformanceDistribution, students, getKpis } from '@/data/students';

export function ExamPage() {
  const histogram = getExamHistogram();
  const dist = getPerformanceDistribution();
  const kpis = getKpis();

  const topStudents = [...students].sort((a, b) => b.ExamMarks - a.ExamMarks).slice(0, 10);
  const atRiskStudents = [...students].filter((s) => s.ExamMarks < 50).sort((a, b) => a.ExamMarks - b.ExamMarks).slice(0, 5);

  const stats = {
    mean: students.reduce((a, s) => a + s.ExamMarks, 0) / students.length,
    median: [...students].sort((a, b) => a.ExamMarks - b.ExamMarks)[Math.floor(students.length / 2)].ExamMarks,
    stdDev: (() => {
      const m = students.reduce((a, s) => a + s.ExamMarks, 0) / students.length;
      return Math.sqrt(students.reduce((a, s) => a + (s.ExamMarks - m) ** 2, 0) / students.length);
    })(),
    range: Math.max(...students.map((s) => s.ExamMarks)) - Math.min(...students.map((s) => s.ExamMarks)),
  };

  return (
    <div className="space-y-6">
      {/* Stats pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill label="Mean" value={stats.mean.toFixed(1)} color="text-cyan-300" icon={<BarChart3 size={18} />} />
        <StatPill label="Median" value={stats.median.toFixed(1)} color="text-emerald-300" icon={<BarChart3 size={18} />} />
        <StatPill label="Std Deviation" value={stats.stdDev.toFixed(1)} color="text-amber-300" icon={<BarChart3 size={18} />} />
        <StatPill label="Range" value={stats.range.toFixed(0)} color="text-violet-300" icon={<BarChart3 size={18} />} />
      </div>

      {/* Histogram */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Examination Score Distribution"
          subtitle="Frequency of marks across score ranges"
          icon={<GraduationCap size={20} />}
        />
        <Histogram data={histogram} height={300} />
      </GlassCard>

      {/* Donut + bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <SectionHeader
            title="Performance Categories"
            subtitle="Distribution across defined tiers"
            icon={<PieChart size={20} />}
          />
          <DonutChart data={dist} size={220} />
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-300">{dist[0].count + dist[1].count}</p>
              <p className="text-xs text-white/40">Students above target</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-300">{dist[3].count}</p>
              <p className="text-xs text-white/40">Need academic support</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader
            title="Top 10 Performers"
            subtitle="Highest examination marks"
            icon={<Award size={20} />}
          />
          <BarChart
            data={topStudents.map((s) => ({ label: s.StudentID, value: s.ExamMarks }))}
            height={300}
            formatValue={(v) => `${v}`}
          />
        </GlassCard>
      </div>

      {/* At-risk students */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Academic Support Indicators"
          subtitle="Records flagged for educator review — not automated decisions"
          icon={<AlertTriangle size={20} />}
        />
        {atRiskStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/10">
                  <th className="pb-3 font-medium">Student ID</th>
                  <th className="pb-3 font-medium">Exam Marks</th>
                  <th className="pb-3 font-medium">Attendance</th>
                  <th className="pb-3 font-medium">Study Hours</th>
                  <th className="pb-3 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((s) => (
                  <tr key={s.StudentID} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white/80 font-medium">{s.StudentID}</td>
                    <td className="py-3"><span className="text-rose-300 font-semibold">{s.ExamMarks}</span></td>
                    <td className="py-3 text-white/60">{s.Attendance}%</td>
                    <td className="py-3 text-white/60">{s.StudyHours} hrs</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-300 border border-rose-500/20">Needs Support</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/50 text-sm">No students currently flagged.</p>
        )}
      </GlassCard>
    </div>
  );
}
