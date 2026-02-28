
import React, { useState } from 'react';
import { TabType, JobApplication, Recommendation } from '../types';
import Header from './Header';
import NavTabs from './NavTabs';
import ApplicationHistory from './ApplicationHistory';
import Recommendations from './Recommendations';
import ResumeContext from './ResumeContext';
import DraftingView from './DraftingView';
import SkillSearchModal from './SkillSearchModal';
import { StatsUpSquare as ChartBarIcon, Code as CommandLineIcon } from 'iconoir-react';

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
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  
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
      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none ${active ? 'bg-white' : 'bg-bg-input border border-border-subtle'}`}
    >
      <div 
        className={`absolute top-0.5 w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${active ? 'bg-black' : 'bg-text-tertiary'}`} 
        style={{ transform: active ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );

  return (
    <div className={`
      w-[380px] h-[600px] bg-bg-panel rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]
      flex flex-col overflow-hidden border border-border-strong 
      transition-all duration-300 origin-bottom-right
      ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95 pointer-events-none'}
    `}>
      <Header />
      
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8">
        {activeTab === TabType.HISTORY && (
          <>
            {isDrafting ? (
              <DraftingView onCancel={() => setIsDrafting(false)} />
            ) : (
              <div className="space-y-6">
                <ResumeContext onStartDraft={() => setIsDrafting(true)} />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Recent Applications</span>
                    <button className="text-[10px] text-text-secondary hover:text-text-primary uppercase tracking-widest font-bold transition-colors">See All</button>
                  </div>
                  <ApplicationHistory applications={applications} />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Recommended for you</span>
                  <Recommendations recommendations={recommendations} />
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === TabType.AUTO_APPLY && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
             <div className="w-16 h-16 bg-bg-input rounded-full grid place-items-center border border-border-subtle">
                <ChartBarIcon className="w-6 h-6 text-text-tertiary" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Auto-Apply is Off</h3>
               <p className="text-[11px] text-text-secondary font-mono leading-relaxed mt-1">Enable premium to unlock background job matching and auto-drafting.</p>
             </div>
             <button className="w-full bg-white text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-95 shadow-lg">
                Enable Auto-Apply
             </button>
          </div>
        )}

        {activeTab === TabType.SETTINGS && (
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest font-bold">IAAI Skills Engine</h3>
              <div className="bg-bg-input p-4 rounded-2xl border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg grid place-items-center">
                    <CommandLineIcon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">Skills Search</div>
                    <div className="text-[10px] text-text-tertiary">Find & add technical skills</div>
                  </div>
                </div>
                <SkillSearchModal 
                  isOpen={isSkillModalOpen} 
                  onClose={() => setIsSkillModalOpen(false)} 
                  onSelectSkill={(skill) => console.log('Selected skill:', skill)} 
                />
                <button 
                  onClick={() => setIsSkillModalOpen(true)}
                  className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Open
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest font-bold">AI Agent Model</h3>
              <div className="grid grid-cols-1 gap-2">
                {API_KEYS.map((key) => (
                  <button
                    key={key.name}
                    onClick={() => setSelectedApiKey(key.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                      selectedApiKey === key.name 
                        ? 'border-white/20 bg-white/5 text-text-primary shadow-lg' 
                        : 'border-border-subtle bg-transparent text-text-secondary hover:border-border-strong'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-bold uppercase tracking-tight">{key.name}</span>
                      <span className={`text-[9px] font-mono uppercase ${selectedApiKey === key.name ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                        {key.status}
                      </span>
                    </div>
                    {selectedApiKey === key.name && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest font-bold">Preferences</h3>
              <div className="space-y-2">
                <div 
                  className="bg-bg-input p-4 rounded-xl border border-border-subtle flex items-center justify-between cursor-pointer hover:border-border-strong transition-all"
                  onClick={() => setResumeSync(!resumeSync)}
                >
                  <div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Resume Sync</span>
                    <p className="text-[9px] text-text-tertiary mt-0.5">Keep local resume updated</p>
                  </div>
                  <Toggle active={resumeSync} onToggle={() => setResumeSync(!resumeSync)} />
                </div>
                <div 
                  className="bg-bg-input p-4 rounded-xl border border-border-subtle flex items-center justify-between cursor-pointer hover:border-border-strong transition-all"
                  onClick={() => setDetailedDrafts(!detailedDrafts)}
                >
                  <div>
                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">Detailed Drafts</span>
                    <p className="text-[9px] text-text-tertiary mt-0.5">Generate full cover letters</p>
                  </div>
                  <Toggle active={detailedDrafts} onToggle={() => setDetailedDrafts(!detailedDrafts)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPanel;
