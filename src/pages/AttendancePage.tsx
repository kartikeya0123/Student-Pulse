import { CalendarCheck, ScatterChart as ScatterIcon, BarChart3 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScatterPlot, HBarChart, SectionHeader, StatPill, ProgressRing } from '@/components/charts/Charts';
import { getScatterData, getCorrelation, getAttendanceBands, students } from '@/data/students';

export function AttendancePage() {
  const scatter = getScatterData('Attendance', 'ExamMarks');
  const correlation = getCorrelation('Attendance', 'ExamMarks');
  const bands = getAttendanceBands();

  const avgAttendance = students.reduce((a, s) => a + s.Attendance, 0) / students.length;
  const highAttendance = students.filter((s) => s.Attendance >= 85).length;
  const lowAttendance = students.filter((s) => s.Attendance < 60).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill label="Mean Attendance" value={`${avgAttendance.toFixed(1)}%`} color="text-cyan-300" icon={<CalendarCheck size={18} />} />
        <StatPill label="Correlation (r)" value={correlation.toFixed(3)} color="text-emerald-300" icon={<ScatterIcon size={18} />} />
        <StatPill label="High Attendance (85+)" value={`${highAttendance}`} color="text-blue-300" icon={<BarChart3 size={18} />} />
        <StatPill label="Low Attendance (<60)" value={`${lowAttendance}`} color="text-rose-300" icon={<BarChart3 size={18} />} />
      </div>

      <GlassCard className="p-6">
        <SectionHeader
          title="Attendance vs. Examination Marks"
          subtitle="Scatter plot showing the relationship between attendance and exam performance"
          icon={<ScatterIcon size={20} />}
        />
        <ScatterPlot data={scatter} xLabel="Attendance (%)" yLabel="Exam Marks" height={340} />
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm">
          <span className="text-white/50">Pearson Correlation:</span>
          <span className={`font-bold ${correlation > 0.5 ? 'text-emerald-300' : correlation > 0.3 ? 'text-amber-300' : 'text-rose-300'}`}>
            r = {correlation.toFixed(3)}
          </span>
          <span className="text-white/30 text-xs">
            {correlation > 0.7 ? 'Strong positive association' : correlation > 0.4 ? 'Moderate positive association' : 'Weak association'}
            — association, not causation
          </span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeader
            title="Exam Performance by Attendance Band"
            subtitle="Average exam marks grouped by attendance tier"
            icon={<BarChart3 size={20} />}
          />
          <HBarChart
            data={bands.map((b) => ({ label: b.label, value: b.count, secondary: b.avgExam }))}
            showSecondary
            height={240}
          />
        </GlassCard>

        <GlassCard className="p-6 flex flex-col items-center justify-center">
          <SectionHeader title="Avg Attendance" subtitle="Across all records" />
          <ProgressRing value={avgAttendance} max={100} label="Attendance" color="#22d3ee" size={160} />
          <div className="mt-4 grid grid-cols-2 gap-3 w-full">
            {bands.map((b) => (
              <div key={b.label} className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-xs text-white/40">{b.label.split(' ')[0]}</p>
                <p className="text-sm font-semibold text-white">{b.count}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
