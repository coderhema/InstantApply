
import React from 'react';
import { Check } from 'iconoir-react';

interface ResumeContextProps {
  onStartDraft: () => void;
}

const ResumeContext: React.FC<ResumeContextProps> = ({ onStartDraft }) => {
  return (
    <div className="bg-bg-input p-5 rounded-2xl border border-border-subtle mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-white rounded-full ai-pulse"></div>
        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Active on this page</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white text-black rounded-full grid place-items-center shadow-lg">
            <Check className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold uppercase tracking-tight text-text-primary">Anthropic</span>
            <span className="font-mono text-[10px] text-text-tertiary">Frontend Engineer</span>
          </div>
        </div>
        <button 
          onClick={onStartDraft}
          className="bg-white text-black px-4 py-2 rounded-full font-mono text-[10px] transition-transform hover:scale-105 active:scale-95 font-bold shadow-lg"
        >
          INSTANT APPLY
        </button>
      </div>
    </div>
  );
};

export default ResumeContext;
