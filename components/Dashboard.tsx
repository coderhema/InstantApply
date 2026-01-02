
import React, { useState, useMemo } from 'react';
import { FormEntry, FormStatus } from '../types';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArchive,
  FaFileAlt,
  FaLink,
  FaEye,
  FaTrash,
  FaSearch,
  FaFolderOpen,
  FaPlus
} from 'react-icons/fa';

/**
 * Custom SVG component for a subtle "stroke to check" animation.
 */
const AnimatedCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" className="animate-check-circle" />
    <path d="M8 12.5L10.5 15L16 9" className="animate-check-path" />
  </svg>
);

interface DashboardProps {
  forms: FormEntry[];
  onNewHook?: () => void;
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ forms, onNewHook, searchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState<FormStatus | 'ALL'>('ALL');

  const stats = useMemo(() => {
    return {
      pending: forms.filter(f => f.status === FormStatus.PENDING).length,
      filled: forms.filter(f => f.status === FormStatus.FILLED).length,
      error: forms.filter(f => f.status === FormStatus.ERROR).length,
    };
  }, [forms]);

  const filteredForms = useMemo(() => {
    let result = forms;
    if (activeFilter !== 'ALL') {
      result = result.filter(f => f.status === activeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.title.toLowerCase().includes(query) || 
        f.url.toLowerCase().includes(query)
      );
    }
    return result;
  }, [forms, activeFilter, searchQuery]);

  const getStatusDisplay = (status: FormStatus) => {
    switch (status) {
      case FormStatus.FILLED:
        return {
          label: 'Active',
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
          icon: <AnimatedCheck />
        };
      case FormStatus.PENDING:
        return {
          label: 'Queued',
          color: 'text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30',
          icon: <FaClock />
        };
      case FormStatus.ERROR:
        return {
          label: 'Action Required',
          color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
          icon: <FaExclamationTriangle />
        };
      case FormStatus.CLOSED:
        return {
          label: 'Archived',
          color: 'text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/20',
          icon: <FaArchive />
        };
      default:
        return {
          label: status,
          color: 'text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/30',
          icon: <FaFileAlt />
        };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Workspace</h2>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium">Monitoring {forms.length} synchronized form hooks.</p>
        </div>
        <button
          onClick={onNewHook}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-zinc-100 dark:shadow-none"
        >
          <FaPlus size={12} /> New Hook
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'Completed', count: stats.filled, color: 'text-emerald-600 dark:text-emerald-400', icon: <AnimatedCheck /> },
          { label: 'Pending', count: stats.pending, color: 'text-zinc-400 dark:text-zinc-500', icon: <FaClock /> },
          { label: 'Errors', count: stats.error, color: 'text-rose-500 dark:text-rose-400', icon: <FaExclamationTriangle /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl flex flex-col justify-between h-32 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className={`text-lg ${stat.color}`}>{stat.icon}</span>
              <span className="text-[10px] font-bold text-slate-300 dark:text-zinc-600 uppercase tracking-widest">Live</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stat.count}</p>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-tighter mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-6 border-b border-slate-100 dark:border-zinc-900">
          {['ALL', FormStatus.FILLED, FormStatus.PENDING, FormStatus.ERROR].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`pb-4 text-[13px] font-bold transition-all relative ${activeFilter === f ? 'text-zinc-900 dark:text-zinc-100' : 'text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400'
                }`}
            >
              {f === 'ALL' ? 'Everything' : getStatusDisplay(f as FormStatus).label}
              {activeFilter === f && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredForms.map((form) => {
            const statusInfo = getStatusDisplay(form.status);
            return (
              <div
                key={form.id}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-zinc-800 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${statusInfo.color}`}>
                    {statusInfo.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-4">{form.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                      <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 whitespace-nowrap">{new Date(form.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span className="w-1 h-1 bg-slate-200 dark:bg-zinc-800 rounded-full flex-shrink-0" />
                      <span className="text-[11px] text-indigo-400 dark:text-indigo-500 font-medium truncate">{form.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"><FaEye size={14} /></button>
                    <button className="p-2 text-slate-400 dark:text-zinc-600 hover:text-rose-500"><FaTrash size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredForms.length === 0 && (
            <div className="py-20 text-center">
              <span className="mx-auto text-slate-200 dark:text-zinc-800 text-3xl mb-4 block w-fit">
                <FaFolderOpen />
              </span>
              <p className="text-sm font-medium text-slate-400 dark:text-zinc-600 tracking-tight">No matching records found in this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
