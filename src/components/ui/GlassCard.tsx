import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl
        bg-white/10 dark:bg-white/5
        backdrop-blur-xl
        border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        ${hover ? 'transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
