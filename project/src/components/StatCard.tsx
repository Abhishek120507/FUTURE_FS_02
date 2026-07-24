import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  gradient: string;
  sub?: string;
}

export default function StatCard({ label, value, icon: Icon, gradient, sub }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${gradient} opacity-20 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
