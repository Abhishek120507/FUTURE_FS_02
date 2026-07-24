import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Trophy, Target, Clock, Filter } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { LEAD_STATUSES } from '../types/lead';
import StatCard from '../components/StatCard';

const statusColors: Record<string, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-cyan-500',
  Qualified: 'bg-violet-500',
  'Proposal Sent': 'bg-amber-500',
  Won: 'bg-emerald-500',
  Lost: 'bg-red-500',
};

export default function DashboardPage() {
  const { leads, loading } = useLeads();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.status === 'Won').length;
    const lost = leads.filter((l) => l.status === 'Lost').length;
    const active = total - won - lost;
    const highPriority = leads.filter((l) => l.priority === 'High').length;
    const winRate = total > 0 ? Math.round((won / (won + lost || 1)) * 100) : 0;
    const byStatus = LEAD_STATUSES.map((s) => ({
      status: s,
      count: leads.filter((l) => l.status === s).length,
    }));
    const maxCount = Math.max(1, ...byStatus.map((b) => b.count));
    return { total, won, active, highPriority, winRate, byStatus, maxCount };
  }, [leads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats.total} icon={Users} gradient="bg-gradient-to-br from-blue-500 to-cyan-400" sub={`${stats.active} active in pipeline`} />
        <StatCard label="Won Deals" value={stats.won} icon={Trophy} gradient="bg-gradient-to-br from-emerald-500 to-teal-400" sub={`${stats.winRate}% win rate`} />
        <StatCard label="High Priority" value={stats.highPriority} icon={Target} gradient="bg-gradient-to-br from-amber-500 to-orange-400" sub="Need attention" />
        <StatCard label="Active Pipeline" value={stats.active} icon={TrendingUp} gradient="bg-gradient-to-br from-violet-500 to-fuchsia-400" sub="In progress" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Pipeline Distribution</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Leads by status</p>
            </div>
            <Filter className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {stats.byStatus.map((b) => (
              <div key={b.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{b.status}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{b.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${statusColors[b.status]} transition-all duration-700 ease-out`}
                    style={{ width: `${(b.count / stats.maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Leads</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {l.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{l.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{l.company || l.email || '—'}</p>
                  </div>
                  <span className={`flex-shrink-0 w-2 h-2 rounded-full ${statusColors[l.status]}`} title={l.status} />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/leads')}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
          >
            View all leads
          </button>
        </div>
      </div>
    </div>
  );
}
