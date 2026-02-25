
import React from 'react';

interface ResumeContextProps {
  onStartDraft: () => void;
}

const ResumeContext: React.FC<ResumeContextProps> = ({ onStartDraft }) => {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-white rounded-full ai-pulse"></div>
        <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Active on this page</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white text-black rounded-full grid place-items-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold uppercase tracking-tight text-white">Anthropic</span>
            <span className="font-mono text-[10px] text-white/40">Frontend Engineer</span>
          </div>
        </div>
        <button 
          onClick={onStartDraft}
          className="bg-white text-black px-3 py-1.5 rounded-full font-mono text-[10px] transition-transform hover:scale-105 active:scale-95 font-bold"
        >
          INSTANT APPLY
        </button>
      </div>
    </div>
  );
};

export default ResumeContext;
