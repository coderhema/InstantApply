
import React, { useState } from 'react';
import { TabType, JobApplication, Recommendation } from '../types';
import Header from './Header';
import NavTabs from './NavTabs';
import ApplicationHistory from './ApplicationHistory';
import Recommendations from './Recommendations';
import ResumeContext from './ResumeContext';
import DraftingView from './DraftingView';

interface AppPanelProps {
  isOpen: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  applications: JobApplication[];
  recommendations: Recommendation[];
}

const AppPanel: React.FC<AppPanelProps> = ({ 
  isOpen, 
  activeTab, 
  setActiveTab, 
  applications, 
  recommendations 
}) => {
  const [isDrafting, setIsDrafting] = useState(false);
  
  // Settings States
  const [resumeSync, setResumeSync] = useState(true);
  const [detailedDrafts, setDetailedDrafts] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState('Gemini 1.5 Flash');

  if (!isOpen) return null;

  const API_KEYS = [
    { name: 'Gemini 1.5 Flash', status: 'Active' },
    { name: 'Gemini 1.5 Pro', status: 'Available' },
    { name: 'GPT-4o Mini', status: 'Connected' },
  ];

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none ${active ? 'bg-white' : 'bg-white/10'}`}
    >
      <div 
        className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${active ? 'bg-black' : 'bg-white/40'}`} 
        style={{ transform: active ? 'translateX(20px)' : 'translateX(4px)' }}
      />
    </button>
  );

  return (
    <div className={`
      w-[380px] h-[600px] bg-[#111111] rounded-xl-plus shadow-[0_20px_40px_rgba(0,0,0,0.4),0_1px_3px_rgba(255,255,255,0.05)]
      flex flex-col overflow-hidden border border-white/10 
      transition-all duration-300 origin-bottom-right
      ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95 pointer-events-none'}
    `}>
      <Header />
      
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {activeTab === TabType.HISTORY && (
          <>
            {isDrafting ? (
              <DraftingView onCancel={() => setIsDrafting(false)} />
            ) : (
              <>
                <ResumeContext onStartDraft={() => setIsDrafting(true)} />
                <div className="flex justify-between items-center mt-3 mb-4">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Recent Applications</span>
                  <button className="text-[11px] text-white font-bold uppercase tracking-widest hover:opacity-70">See All</button>
                </div>
                <ApplicationHistory applications={applications} />
                <div className="mt-8 mb-4">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Recommended for you</span>
                </div>
                <Recommendations recommendations={recommendations} />
              </>
            )}
          </>
        )}
        
        {activeTab === TabType.AUTO_APPLY && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-white/5 rounded-full grid place-items-center mb-4 border border-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
             </div>
             <h3 className="text-sm font-bold mb-1 uppercase tracking-tight text-white">Auto-Apply is Off</h3>
             <p className="text-[10px] text-white/40 font-mono leading-relaxed">Enable premium to unlock background job matching and auto-drafting.</p>
          </div>
        )}

        {activeTab === TabType.SETTINGS && (
          <div className="space-y-4 pt-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3 block">AI Agent Model</span>
              <div className="space-y-2">
                {API_KEYS.map((key) => (
                  <button
                    key={key.name}
                    onClick={() => setSelectedApiKey(key.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-200 ${
                      selectedApiKey === key.name 
                        ? 'border-white bg-white text-black shadow-md' 
                        : 'border-white/5 bg-white/5 text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-bold uppercase tracking-tight">{key.name}</span>
                      <span className={`text-[9px] font-mono uppercase ${selectedApiKey === key.name ? 'text-black/60' : 'text-white/40'}`}>
                        {key.status}
                      </span>
                    </div>
                    {selectedApiKey === key.name && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div 
              className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => setResumeSync(!resumeSync)}
            >
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 block">Profile Settings</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-tight">Resume Sync</span>
                <Toggle active={resumeSync} onToggle={() => setResumeSync(!resumeSync)} />
              </div>
            </div>
            <div 
              className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => setDetailedDrafts(!detailedDrafts)}
            >
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 block">AI Preferences</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-tight">Detailed Drafts</span>
                <Toggle active={detailedDrafts} onToggle={() => setDetailedDrafts(!detailedDrafts)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPanel;
