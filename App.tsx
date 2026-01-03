
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import FormHook from './components/FormHook';
import { storageService } from './services/storageService';
import { UserProfile, FormEntry, FormStatus } from './types';
import { INITIAL_PROFILE, MOCK_FORMS } from './constants';
import { 
  FaBell, 
  FaSearch, 
  FaCog, 
  FaChartBar, 
  FaLink, 
  FaUser,
  FaShieldAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [forms, setForms] = useState<FormEntry[]>(MOCK_FORMS);

  // Load persistent data
  useEffect(() => {
    const loadData = async () => {
      const savedProfile = await storageService.getProfile();
      if (savedProfile) setProfile(savedProfile);
      
      const savedForms = await storageService.getForms();
      if (savedForms) setForms(savedForms);
    };
    loadData();
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    // Profile component handles the storage save, but we could do it here too for redundancy
  };

  const handleCompleteForm = async (title: string, url: string) => {
    const newForm: FormEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || 'New Hook Result',
      url,
      status: FormStatus.FILLED,
      createdAt: Date.now(),
    };
    const updatedForms = [newForm, ...forms];
    setForms(updatedForms);
    await storageService.saveForms(updatedForms);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard forms={forms} onNewHook={() => setActiveTab('hook')} searchQuery={searchQuery} />;
      case 'profile': return <Profile profile={profile} onSave={handleUpdateProfile} />;
      case 'hook': return <FormHook profile={profile} onComplete={handleCompleteForm} />;
      case 'settings':
        return (
          <div className="max-w-3xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">Security & Preferences</h2>
            <div className="space-y-4">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl flex items-center justify-between transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center"><FaShieldAlt /></div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Privacy Mode</h3>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Anonymize personal data before sending to AI.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-zinc-900 dark:bg-zinc-700 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>
          </div>
        );
      default: return <Dashboard forms={forms} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-zinc-950 overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900/30 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-20 flex items-center justify-between px-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 z-10 transition-colors">
          <div className={`flex items-center gap-3 transition-all duration-300 ease-out group ${
            isSearchFocused || searchQuery ? 'w-full max-w-md' : 'w-10'
          }`}>
            <button 
              onClick={() => searchInputRef.current?.focus()}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                isSearchFocused ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : 'bg-slate-50 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <FaSearch size={14} />
            </button>
            <div className={`flex-1 relative transition-all duration-300 ${
              isSearchFocused || searchQuery ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none w-0 overflow-hidden'
            }`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search hooks..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-slate-300 dark:placeholder:text-zinc-600"
              />
              {!searchQuery && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <p className="text-[10px] font-bold text-slate-300 dark:text-zinc-700 uppercase tracking-widest hidden md:block border border-slate-100 dark:border-zinc-800 px-2 py-0.5 rounded-md">Cmd + K</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">Agent Optimized</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800" />
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsDarkMode(!isDarkMode)}
                 className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
               >
                 {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
               </button>
               <button className="text-slate-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><FaBell size={18} /></button>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Mobile Shell */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-zinc-950 dark:bg-zinc-900 rounded-2xl flex items-center justify-around px-6 z-50 shadow-2xl shadow-zinc-900/40">
         {[
           { id: 'dashboard', icon: <FaChartBar /> },
           { id: 'hook', icon: <FaLink /> },
           { id: 'profile', icon: <FaUser /> },
           { id: 'settings', icon: <FaCog /> }
         ].map(item => (
           <button 
             key={item.id}
             onClick={() => setActiveTab(item.id)} 
             className={`p-2 rounded-lg transition-all ${activeTab === item.id ? 'text-white' : 'text-zinc-600 dark:text-zinc-500'}`}
           >
             <span className="text-lg">{item.icon}</span>
           </button>
         ))}
      </div>
    </div>
  );
};

export default App;
