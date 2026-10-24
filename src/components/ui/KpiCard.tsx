import {
  Users,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Trophy,
  TrendingDown,
  BookOpen,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  icon: string;
  accent: string;
}

const iconMap: Record<string, typeof Users> = {
  users: Users,
  graduation: GraduationCap,
  calendar: CalendarCheck,
  'check-circle': CheckCircle2,
  trophy: Trophy,
  'trending-down': TrendingDown,
  book: BookOpen,
  'file-text': FileText,
};

const accentColors: Record<string, { glow: string; text: string; bg: string }> = {
  cyan: { glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]', text: 'text-cyan-300', bg: 'bg-cyan-500/20' },
  emerald: { glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', text: 'text-emerald-300', bg: 'bg-emerald-500/20' },
  amber: { glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]', text: 'text-amber-300', bg: 'bg-amber-500/20' },
  blue: { glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]', text: 'text-blue-300', bg: 'bg-blue-500/20' },
  rose: { glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]', text: 'text-rose-300', bg: 'bg-rose-500/20' },
  violet: { glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]', text: 'text-violet-300', bg: 'bg-violet-500/20' },
  teal: { glow: 'shadow-[0_0_30px_rgba(20,184,166,0.15)]', text: 'text-teal-300', bg: 'bg-teal-500/20' },
  orange: { glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]', text: 'text-orange-300', bg: 'bg-orange-500/20' },
};

export function KpiCard({ label, value, unit, trend, icon, accent }: KpiCardProps) {
  const Icon = iconMap[icon] ?? Users;
  const colors = accentColors[accent] ?? accentColors.cyan;

  return (
    <GlassCard hover className={`p-5 ${colors.glow}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white tracking-tight">
          {value}
          {unit && <span className="text-lg font-normal text-white/50 ml-0.5">{unit}</span>}
        </p>
        <p className="text-sm text-white/60 mt-1">{label}</p>
      </div>
    </GlassCard>
  );
}
