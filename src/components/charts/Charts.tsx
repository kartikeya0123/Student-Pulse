import { useState, type ReactNode } from 'react';

// ============= Bar Chart =============
interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  yLabel?: string;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, height = 280, yLabel, formatValue }: BarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;
  const chartH = height - 50;
  const barW = 100 / data.length;
  const colors = ['#22d3ee', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6'];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          {colors.map((c, i) => (
            <linearGradient key={i} id={`bargrad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.9" />
              <stop offset="100%" stopColor={c} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line key={p} x1="8" y1={5 + p * (chartH / 4 - 5)} x2="98" y2={5 + p * (chartH / 4 - 5)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const h = (d.value / maxVal) * (chartH / 4 - 8);
          const y = chartH / 4 - h - 3;
          const x = 10 + i * (barW * 0.85) + 2;
          const w = barW * 0.6;
          const color = d.color || colors[i % colors.length];
          const gradId = `bargrad-${i % colors.length}`;
          return (
            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
              <rect
                x={x} y={y} width={w} height={h}
                fill={`url(#${gradId})`}
                rx="0.6"
                style={{ transition: 'all 0.3s', filter: hoverIdx === i ? 'brightness(1.3)' : 'none' }}
              />
              {hoverIdx === i && (
                <text x={x + w / 2} y={y - 1.5} textAnchor="middle" fill="white" fontSize="2.5" fontWeight="700">
                  {formatValue ? formatValue(d.value) : d.value}
                </text>
              )}
              <text x={x + w / 2} y={chartH / 4 + 3} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="2.2">
                {d.label.length > 12 ? d.label.slice(0, 10) + '…' : d.label}
              </text>
            </g>
          );
        })}
        {yLabel && (
          <text x="2" y={chartH / 8} fill="rgba(255,255,255,0.4)" fontSize="2" transform={`rotate(-90 2 ${chartH / 8})`}>
            {yLabel}
          </text>
        )}
      </svg>
    </div>
  );
}

// ============= Histogram =============
interface HistogramProps {
  data: { range: string; count: number }[];
  height?: number;
}

export function Histogram({ data, height = 280 }: HistogramProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.count)) * 1.2;
  const chartH = height - 50;
  const barW = 100 / data.length;

  return (
    <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="histgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line key={p} x1="8" y1={5 + p * (chartH / 4 - 5)} x2="98" y2={5 + p * (chartH / 4 - 5)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
      ))}
      {data.map((d, i) => {
        const h = (d.count / maxVal) * (chartH / 4 - 8);
        const y = chartH / 4 - h - 3;
        const x = 10 + i * (barW * 0.85) + 2;
        const w = barW * 0.65;
        return (
          <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
            <rect x={x} y={y} width={w} height={h} fill="url(#histgrad)" rx="0.5"
              style={{ transition: 'all 0.3s', filter: hoverIdx === i ? 'brightness(1.3)' : 'none' }} />
            {hoverIdx === i && (
              <>
                <text x={x + w / 2} y={y - 1.5} textAnchor="middle" fill="white" fontSize="2.5" fontWeight="700">{d.count}</text>
                <rect x={x - 1} y={y - 1.5} width={w + 2} height={h + 1.5} fill="none" stroke="#22d3ee" strokeWidth="0.2" rx="0.5" />
              </>
            )}
            <text x={x + w / 2} y={chartH / 4 + 3} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="2">{d.range}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============= Scatter Plot =============
interface ScatterProps {
  data: { x: number; y: number; id: string; category: string }[];
  xLabel: string;
  yLabel: string;
  height?: number;
}

const categoryColors: Record<string, string> = {
  Excellent: '#10b981',
  Good: '#22d3ee',
  Satisfactory: '#f59e0b',
  'Needs Support': '#f43f5e',
};

export function ScatterPlot({ data, xLabel, yLabel, height = 320 }: ScatterProps) {
  const [hoverPt, setHoverPt] = useState<number | null>(null);
  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));
  const yMin = Math.min(...data.map((d) => d.y));
  const yMax = Math.max(...data.map((d) => d.y));
  const pad = 8;

  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin || 1)) * (100 - pad * 2);
  const sy = (y: number) => (height / 4) - pad - ((y - yMin) / (yMax - yMin || 1)) * ((height / 4) - pad * 2);

  return (
    <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <g key={p}>
          <line x1={pad} y1={pad + p * ((height / 4) - pad * 2)} x2={100 - pad} y2={pad + p * ((height / 4) - pad * 2)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.12" />
          <line x1={pad + p * (100 - pad * 2)} y1={pad} x2={pad + p * (100 - pad * 2)} y2={height / 4 - pad} stroke="rgba(255,255,255,0.06)" strokeWidth="0.12" />
        </g>
      ))}
      {/* Trend line (simple linear regression) */}
      {(() => {
        const n = data.length;
        const mx = data.reduce((a, d) => a + d.x, 0) / n;
        const my = data.reduce((a, d) => a + d.y, 0) / n;
        let num = 0, den = 0;
        data.forEach((d) => { num += (d.x - mx) * (d.y - my); den += (d.x - mx) ** 2; });
        const slope = num / (den || 1);
        const yAtXMin = my + slope * (xMin - mx);
        const yAtXMax = my + slope * (xMax - mx);
        return (
          <line x1={sx(xMin)} y1={sy(yAtXMin)} x2={sx(xMax)} y2={sy(yAtXMax)} stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" strokeDasharray="0.8 0.4" />
        );
      })()}
      {/* Points */}
      {data.map((d, i) => (
        <g key={i} onMouseEnter={() => setHoverPt(i)} onMouseLeave={() => setHoverPt(null)}>
          <circle cx={sx(d.x)} cy={sy(d.y)} r={hoverPt === i ? 1.2 : 0.7} fill={categoryColors[d.category] || '#fff'} opacity={hoverPt === null || hoverPt === i ? 0.8 : 0.2}
            style={{ transition: 'r 0.2s, opacity 0.2s' }} />
          {hoverPt === i && (
            <g>
              <rect x={sx(d.x) + 1.5} y={sy(d.y) - 3} width="14" height="5" rx="0.5" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.1" />
              <text x={sx(d.x) + 2.5} y={sy(d.y) - 1.2} fill="white" fontSize="1.8" fontWeight="600">{d.id}</text>
              <text x={sx(d.x) + 2.5} y={sy(d.y) + 0.2} fill="rgba(255,255,255,0.6)" fontSize="1.5">({d.x}, {d.y})</text>
            </g>
          )}
        </g>
      ))}
      {/* Axis labels */}
      <text x="50" y={height / 4 - 0.5} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="2.2">{xLabel}</text>
      <text x="2" y={height / 8} fill="rgba(255,255,255,0.5)" fontSize="2.2" transform={`rotate(-90 2 ${height / 8})`}>{yLabel}</text>
    </svg>
  );
}

// ============= Donut Chart =============
interface DonutProps {
  data: { label: string; count: number }[];
  size?: number;
}

export function DonutChart({ data, size = 240 }: DonutProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.count, 0);
  const colors = ['#10b981', '#22d3ee', '#f59e0b', '#f43f5e'];
  const r = 35;
  const cx = 50, cy = 50;
  const strokeW = 12;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        {data.map((d, i) => {
          const pct = d.count / total;
          const dash = pct * circumference;
          const seg = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={hoverIdx === i ? strokeW + 2 : strokeW}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-width 0.2s', cursor: 'pointer', opacity: hoverIdx === null || hoverIdx === i ? 1 : 0.4 }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          );
          offset += dash;
          return seg;
        })}
        <text x="50" y="47" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
          {hoverIdx !== null ? data[hoverIdx].count : total}
        </text>
        <text x="50" y="56" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="4">
          {hoverIdx !== null ? data[hoverIdx].label : 'Total Students'}
        </text>
      </svg>
      <div className="space-y-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer transition-opacity" style={{ opacity: hoverIdx === null || hoverIdx === i ? 1 : 0.4 }}
            onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-sm text-white/70">{d.label}</span>
            <span className="text-sm font-semibold text-white ml-auto">{d.count}</span>
            <span className="text-xs text-white/40 w-12 text-right">{((d.count / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= Line Chart =============
interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 260, color = '#22d3ee' }: LineChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;
  const minVal = Math.min(...data.map((d) => d.value)) * 0.85;
  const chartH = height - 50;
  const pad = 8;

  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1 || 1)) * (100 - pad * 2),
    y: (chartH / 4) - pad - ((d.value - minVal) / (maxVal - minVal || 1)) * ((chartH / 4) - pad * 2),
    label: d.label,
    value: d.value,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${(chartH / 4) - pad} L ${pts[0].x} ${(chartH / 4) - pad} Z`;

  return (
    <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="linegrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line key={p} x1={pad} y1={pad + p * ((chartH / 4) - pad * 2)} x2={100 - pad} y2={pad + p * ((chartH / 4) - pad * 2)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.12" />
      ))}
      <path d={areaD} fill="url(#linegrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
          <circle cx={p.x} cy={p.y} r={hoverIdx === i ? 1.2 : 0.5} fill={color}
            style={{ transition: 'r 0.2s' }} />
          {hoverIdx === i && (
            <g>
              <rect x={p.x - 7} y={p.y - 5} width="14" height="4.5" rx="0.5" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.1" />
              <text x={p.x} y={p.y - 2.5} textAnchor="middle" fill="white" fontSize="1.8" fontWeight="700">{p.value.toFixed(1)}</text>
              <text x={p.x} y={p.y - 0.8} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="1.4">{p.label}</text>
            </g>
          )}
          <text x={p.x} y={(chartH / 4) - pad + 3} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="2">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ============= Horizontal Bar Chart =============
interface HBarDatum {
  label: string;
  value: number;
  secondary?: number;
}

interface HBarChartProps {
  data: HBarDatum[];
  height?: number;
  showSecondary?: boolean;
}

export function HBarChart({ data, height, showSecondary = false }: HBarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.flatMap((d) => [d.value, d.secondary ?? 0])) * 1.2;
  const rowH = showSecondary ? 7 : 5.5;
  const totalH = height ?? (data.length * rowH + 6);

  return (
    <svg viewBox={`0 0 100 ${totalH / 4}`} preserveAspectRatio="none" className="w-full" style={{ height: totalH }}>
      <defs>
        <linearGradient id="hbar-primary" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hbar-secondary" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const y = 2 + i * rowH;
        const w1 = (d.value / maxVal) * 65;
        const w2 = d.secondary !== undefined ? (d.secondary / maxVal) * 65 : 0;
        return (
          <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
            <text x="0" y={y + rowH / 2 - 0.3} fill="rgba(255,255,255,0.6)" fontSize="2" fontWeight="500">{d.label}</text>
            <rect x="28" y={y} width={w1} height={rowH / 2 - 0.5} fill="url(#hbar-primary)" rx="0.4"
              style={{ transition: 'all 0.3s', filter: hoverIdx === i ? 'brightness(1.3)' : 'none' }} />
            {showSecondary && d.secondary !== undefined && (
              <rect x="28" y={y + rowH / 2} width={w2} height={rowH / 2 - 0.5} fill="url(#hbar-secondary)" rx="0.4"
                style={{ transition: 'all 0.3s', filter: hoverIdx === i ? 'brightness(1.3)' : 'none' }} />
            )}
            {hoverIdx === i && (
              <text x={28 + w1 + 1} y={y + rowH / 2 - 0.5} fill="white" fontSize="1.8" fontWeight="700">
                {d.value}{showSecondary && d.secondary !== undefined ? ` / ${d.secondary}` : ''}
              </text>
            )}
          </g>
        );
      })}
      {showSecondary && (
        <g>
          <rect x="28" y={totalH / 4 - 2.5} width="2" height="1" fill="url(#hbar-primary)" />
          <text x="31" y={totalH / 4 - 1.7} fill="rgba(255,255,255,0.5)" fontSize="1.6">Count</text>
          <rect x="45" y={totalH / 4 - 2.5} width="2" height="1" fill="url(#hbar-secondary)" />
          <text x="48" y={totalH / 4 - 1.7} fill="rgba(255,255,255,0.5)" fontSize="1.6">Avg Exam</text>
        </g>
      )}
    </svg>
  );
}

// ============= Progress Ring =============
interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  size?: number;
  color?: string;
  suffix?: string;
}

export function ProgressRing({ value, max, label, size = 140, color = '#22d3ee', suffix = '%' }: ProgressRingProps) {
  const pct = Math.min(value / max, 1);
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const dash = pct * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`} transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="50" y="48" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
          {value.toFixed(1)}{suffix}
        </text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="4">{label}</text>
      </svg>
    </div>
  );
}

// ============= Stat Pill =============
interface StatPillProps {
  label: string;
  value: string;
  icon?: ReactNode;
  color?: string;
}

export function StatPill({ label, value, icon, color = 'text-cyan-300' }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
      {icon && <div className={color}>{icon}</div>}
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className={`text-sm font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

// ============= Section Header =============
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && (
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-cyan-300">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
