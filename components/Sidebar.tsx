
import React from 'react';
import { FaChartBar, FaLink, FaUser, FaCog, FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, onToggle }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'hook', label: 'Hook', icon: <FaLink /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div 
      className={`relative bg-white dark:bg-zinc-950 border-r border-slate-100 dark:border-zinc-900 h-full flex flex-col hidden md:flex transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full flex items-center justify-center text-[10px] text-slate-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-sm z-50 transition-all hover:scale-110"
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className={`p-6 h-20 flex items-center border-b border-slate-50 dark:border-zinc-900 transition-all ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 flex-shrink-0 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none">
            <FaBolt size={14} />
          </div>
          {!isCollapsed && (
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              InstantApply <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
          )}
        </div>
      </div>
      
      <nav className={`flex-1 p-4 flex flex-col space-y-2 mt-4 transition-all ${isCollapsed ? 'items-center' : 'items-stretch'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md active-tab-glow'
                : 'text-slate-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span className="text-lg flex-shrink-0">{tab.icon}</span>
            {!isCollapsed && (
              <span className="text-[13px] font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-300">
                {tab.label}
              </span>
            )}
            
            {/* Tooltip for collapsed view */}
            {isCollapsed && (
              <div className="absolute left-16 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                {tab.label}
              </div>
            )}
            
            {activeTab === tab.id && isCollapsed && (
              <div className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-slate-50 dark:border-zinc-900 transition-all ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <div className={`relative transition-all duration-300 rounded-2xl flex items-center ${
          isCollapsed 
            ? 'justify-center p-1 bg-white/40 dark:bg-indigo-500/10 backdrop-blur-md border border-white/30 dark:border-indigo-500/20 shadow-sm overflow-hidden' 
            : 'justify-start gap-3 p-2 bg-slate-50 dark:bg-zinc-900'
        }`}>
          {/* Shine animation for collapsed icon */}
          {isCollapsed && <span className="animate-shine z-0" />}
          
          <img 
            src="https://picsum.photos/seed/user123/40/40" 
            className={`flex-shrink-0 rounded-xl border border-white dark:border-zinc-800 shadow-sm relative z-10 transition-all ${
              isCollapsed ? 'w-9 h-9' : 'w-8 h-8'
            }`}
            alt="User"
          />
          
          {!isCollapsed && (
            <div className="overflow-hidden animate-in fade-in duration-300">
              <p className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate leading-tight">Alex Rivera</p>
              {/* Glassmorphic Pro Badge with Animation */}
              <div className="mt-1 flex">
                <span className="relative overflow-hidden inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest 
                  bg-white/40 dark:bg-indigo-500/10 
                  backdrop-blur-md 
                  border border-white/30 dark:border-indigo-500/20 
                  text-indigo-600 dark:text-indigo-400 
                  shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] 
                  dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                  ring-1 ring-inset ring-white/20 dark:ring-indigo-400/10
                  cursor-default transition-all hover:scale-105 active:scale-95">
                  <span className="relative z-10">Pro Member</span>
                  {/* The Shine Element */}
                  <span className="animate-shine" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
