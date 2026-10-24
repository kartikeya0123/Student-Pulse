import { BookOpen, ScatterChart as ScatterIcon, BarChart3, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScatterPlot, HBarChart, BarChart, SectionHeader, StatPill } from '@/components/charts/Charts';
import { getScatterData, getCorrelation, getStudyBands, students } from '@/data/students';

export function StudyPage() {
  const scatter = getScatterData('StudyHours', 'ExamMarks');
  const correlation = getCorrelation('StudyHours', 'ExamMarks');
  const bands = getStudyBands();

  const avgStudy = students.reduce((a, s) => a + s.StudyHours, 0) / students.length;
  const maxStudy = Math.max(...students.map((s) => s.StudyHours));
  const minStudy = Math.min(...students.map((s) => s.StudyHours));

  // Study hours distribution
  const studyDist = [
    { range: '1-2', count: students.filter((s) => s.StudyHours <= 2).length },
    { range: '3-4', count: students.filter((s) => s.StudyHours >= 3 && s.StudyHours <= 4).length },
    { range: '5-6', count: students.filter((s) => s.StudyHours >= 5 && s.StudyHours <= 6).length },
    { range: '7-8', count: students.filter((s) => s.StudyHours >= 7 && s.StudyHours <= 8).length },
    { range: '9-10', count: students.filter((s) => s.StudyHours >= 9).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill label="Avg Study Hours" value={`${avgStudy.toFixed(1)} hrs`} color="text-cyan-300" icon={<Clock size={18} />} />
        <StatPill label="Correlation (r)" value={correlation.toFixed(3)} color="text-emerald-300" icon={<ScatterIcon size={18} />} />
        <StatPill label="Max Study Hours" value={`${maxStudy} hrs`} color="text-violet-300" icon={<BookOpen size={18} />} />
        <StatPill label="Min Study Hours" value={`${minStudy} hrs`} color="text-amber-300" icon={<BookOpen size={18} />} />
      </div>

      <GlassCard className="p-6">
        <SectionHeader
          title="Study Hours vs. Examination Marks"
          subtitle="Scatter plot exploring how study time relates to exam outcomes"
          icon={<ScatterIcon size={20} />}
        />
        <ScatterPlot data={scatter} xLabel="Study Hours (per day)" yLabel="Exam Marks" height={340} />
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm">
          <span className="text-white/50">Pearson Correlation:</span>
          <span className={`font-bold ${correlation > 0.5 ? 'text-emerald-300' : correlation > 0.3 ? 'text-amber-300' : 'text-rose-300'}`}>
            r = {correlation.toFixed(3)}
          </span>
          <span className="text-white/30 text-xs">
            {correlation > 0.7 ? 'Strong positive' : correlation > 0.4 ? 'Moderate positive' : 'Weak'} — association only
          </span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <SectionHeader
            title="Study Hours Distribution"
            subtitle="How many students fall into each study-hour bracket"
            icon={<BarChart3 size={20} />}
          />
          <BarChart
            data={studyDist.map((d) => ({ label: `${d.range} hrs`, value: d.count }))}
            height={260}
            formatValue={(v) => `${v}`}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader
            title="Exam Marks by Study Band"
            subtitle="Count and average exam marks per study tier"
            icon={<BarChart3 size={20} />}
          />
          <HBarChart
            data={bands.map((b) => ({ label: b.label, value: b.count, secondary: b.avgExam }))}
            showSecondary
            height={220}
          />
        </GlassCard>
      </div>
    </div>
  );
}
