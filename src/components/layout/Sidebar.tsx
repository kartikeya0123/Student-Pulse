import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Table2,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export type PageId = 'overview' | 'exam' | 'attendance' | 'study' | 'explorer' | 'quality';

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard; desc: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Key metrics & summary' },
  { id: 'exam', label: 'Exam Performance', icon: GraduationCap, desc: 'Score distribution & analysis' },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, desc: 'Attendance vs. marks' },
  { id: 'study', label: 'Study Hours', icon: BookOpen, desc: 'Study patterns & outcomes' },
  { id: 'explorer', label: 'Student Explorer', icon: Table2, desc: 'Search & filter records' },
  { id: 'quality', label: 'Data Quality', icon: ShieldCheck, desc: 'Pipeline status & validation' },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-40
        bg-white/5 backdrop-blur-2xl border-r border-white/10 p-5">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Activity size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">StudentPulse</h1>
            <p className="text-xs text-white/40">Analytics Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left group
                  ${isActive
                    ? 'bg-white/10 border border-white/20 shadow-lg'
                    : 'hover:bg-white/5 border border-transparent'}
                `}
              >
                <div className={`mt-0.5 transition-colors ${isActive ? 'text-cyan-300' : 'text-white/40 group-hover:text-white/70'}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                </div>
                {isActive && <div className="mt-2 w-1 h-1 rounded-full bg-cyan-300 ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/60 font-medium">Pipeline Active</span>
          </div>
          <p className="text-xs text-white/40">Hadoop 3.3.6 · HDFS Connected</p>
          <p className="text-xs text-white/40 mt-1">Dataset v2.1.0 · 200 records</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/10 backdrop-blur-2xl border-t border-white/15 px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-2.5 rounded-xl transition-all ${isActive ? 'bg-white/15 text-cyan-300' : 'text-white/40'}`}
            >
              <Icon size={20} strokeWidth={2} />
            </button>
          );
        })}
      </nav>
    </>
  );
}
