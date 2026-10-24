import { ShieldCheck, AlertTriangle, CheckCircle2, Database, Terminal, FileWarning } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader, ProgressRing } from '@/components/charts/Charts';
import { getDataQuality } from '@/data/students';

export function QualityPage() {
  const dq = getDataQuality();
  const validityRate = (dq.validRows / dq.totalRows) * 100;

  return (
    <div className="space-y-6">
      {/* Pipeline status */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader
            title="Pipeline Execution Status"
            subtitle="Hadoop MapReduce job telemetry"
            icon={<Terminal size={20} />}
          />
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-300">{dq.jobStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Dataset Version</p>
            <p className="text-lg font-semibold text-white">{dq.datasetVersion}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Last Run</p>
            <p className="text-lg font-semibold text-white">{dq.lastRun}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Processing Time</p>
            <p className="text-lg font-semibold text-cyan-300">{dq.processingTime}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Output Location</p>
            <p className="text-sm font-mono text-white/60 break-all">{dq.outputLocation}</p>
          </div>
        </div>
      </GlassCard>

      {/* Validity + Row stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex flex-col items-center justify-center">
          <SectionHeader title="Data Validity" subtitle="Valid vs. rejected rows" />
          <ProgressRing value={validityRate} max={100} label="Valid Records" color="#10b981" size={170} />
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeader
            title="Row Processing Summary"
            subtitle="Breakdown of rows through the MapReduce pipeline"
            icon={<Database size={20} />}
          />
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/60 flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Valid Rows Processed</span>
                <span className="text-white font-semibold">{dq.validRows}</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${validityRate}%`, transition: 'width 0.8s' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/60 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-300" /> Invalid Rows Rejected</span>
                <span className="text-white font-semibold">{dq.invalidRows}</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500" style={{ width: `${((dq.invalidRows / dq.totalRows) * 100).toFixed(1)}%`, transition: 'width 0.8s' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/60 flex items-center gap-2"><Database size={16} className="text-cyan-300" /> Total Rows Read</span>
                <span className="text-white font-semibold">{dq.totalRows}</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: '100%', transition: 'width 0.8s' }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Validation issues */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Data Quality Issues"
          subtitle="Validation failures detected during ingestion"
          icon={<FileWarning size={20} />}
        />
        <div className="space-y-3">
          {dq.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-300 mt-0.5">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold text-white">{issue.type}</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    {issue.count} occurrence{issue.count > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-white/50 mt-1">{issue.description}</p>
              </div>
              <div className="text-right">
                <ShieldCheck size={18} className="text-emerald-300/50" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Architecture note */}
      <GlassCard className="p-6">
        <SectionHeader title="Architecture Notes" subtitle="Current implementation details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs mb-1">Processing Framework</p>
            <p className="text-white/80">Apache Hadoop 3.3.6 · MapReduce (Mapper-only, LocalJobRunner)</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs mb-1">Storage Layer</p>
            <p className="text-white/80">HDFS (primary) · Amazon S3 (planned integration)</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs mb-1">Verified Result</p>
            <p className="text-white/80">AverageExamMarks = 74.5 (initial prototype, 20 records)</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs mb-1">Next Milestone</p>
            <p className="text-white/80">Reducer-based aggregation for multi-split scalability</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
