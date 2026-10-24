import { useState, useMemo } from 'react';
import { Table2, Search, ArrowUpDown, Download, Filter, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/charts/Charts';
import { students, type StudentRecord } from '@/data/students';

type SortKey = keyof StudentRecord;
type SortDir = 'asc' | 'desc';

const categoryStyles: Record<string, string> = {
  Excellent: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  Good: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
  Satisfactory: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  'Needs Support': 'bg-rose-500/20 text-rose-300 border-rose-500/20',
};

export function ExplorerPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('StudentID');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [minExam, setMinExam] = useState(0);
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  const filtered = useMemo(() => {
    let result = students.filter((s) =>
      s.StudentID.toLowerCase().includes(search.toLowerCase())
    );
    if (categoryFilter) {
      result = result.filter((s) => s.PerformanceCategory === categoryFilter);
    }
    result = result.filter((s) => s.ExamMarks >= minExam);
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [search, sortKey, sortDir, categoryFilter, minExam]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCSV = () => {
    const header = 'StudentID,Attendance,StudyHours,PreviousScore,AssignmentMarks,ExamMarks,PerformanceCategory';
    const rows = filtered.map((s) => `${s.StudentID},${s.Attendance},${s.StudyHours},${s.PreviousScore},${s.AssignmentMarks},${s.ExamMarks},${s.PerformanceCategory}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studentpulse_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = ['Excellent', 'Good', 'Satisfactory', 'Needs Support'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <GlassCard className="p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by Student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  categoryFilter === cat
                    ? categoryStyles[cat]
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-white/30" />
            <input
              type="range"
              min={0}
              max={100}
              value={minExam}
              onChange={(e) => setMinExam(+e.target.value)}
              className="accent-cyan-400 w-24"
            />
            <span className="text-xs text-white/50 w-16">Exam ≥ {minExam}</span>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/30 transition-all text-sm font-medium"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-6">
        <SectionHeader
          title="Student Records"
          subtitle={`${filtered.length} of ${students.length} records shown`}
          icon={<Table2 size={20} />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                {([
                  ['StudentID', 'Student ID'],
                  ['Attendance', 'Attendance'],
                  ['StudyHours', 'Study Hours'],
                  ['PreviousScore', 'Prev. Score'],
                  ['AssignmentMarks', 'Assignments'],
                  ['ExamMarks', 'Exam Marks'],
                  ['PerformanceCategory', 'Category'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="pb-3 font-medium pr-4 cursor-pointer hover:text-white/70 transition-colors" onClick={() => handleSort(key)}>
                    <div className="flex items-center gap-1">
                      {label}
                      <ArrowUpDown size={12} className={sortKey === key ? 'text-cyan-300' : 'text-white/20'} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((s) => (
                <tr
                  key={s.StudentID}
                  onClick={() => setSelected(s)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 text-white/80 font-medium">{s.StudentID}</td>
                  <td className="py-2.5 text-white/60">{s.Attendance}%</td>
                  <td className="py-2.5 text-white/60">{s.StudyHours}h</td>
                  <td className="py-2.5 text-white/60">{s.PreviousScore}</td>
                  <td className="py-2.5 text-white/60">{s.AssignmentMarks}</td>
                  <td className="py-2.5">
                    <span className={`font-semibold ${s.ExamMarks >= 70 ? 'text-emerald-300' : s.ExamMarks >= 50 ? 'text-amber-300' : 'text-rose-300'}`}>
                      {s.ExamMarks}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryStyles[s.PerformanceCategory]}`}>
                      {s.PerformanceCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <p className="text-center text-white/30 text-xs mt-4">Showing first 50 results — refine filters to narrow down</p>
        )}
      </GlassCard>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <GlassCard className="p-6 max-w-md w-full" onClick={undefined as never}>
            <div className="flex items-center justify-between mb-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {selected.StudentID.slice(-2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selected.StudentID}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs border ${categoryStyles[selected.PerformanceCategory]}`}>
                    {selected.PerformanceCategory}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
              {([
                ['Attendance', `${selected.Attendance}%`],
                ['Study Hours', `${selected.StudyHours} hrs`],
                ['Previous Score', `${selected.PreviousScore}`],
                ['Assignment Marks', `${selected.AssignmentMarks}`],
                ['Exam Marks', `${selected.ExamMarks}`],
                ['Overall Category', selected.PerformanceCategory],
              ]).map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="text-lg font-semibold text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
