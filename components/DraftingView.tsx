
import React, { useState, useEffect } from 'react';
import { generateDraft } from '../services/geminiService';
import { Copy as CopyIcon, Check as CheckIcon } from 'iconoir-react';

interface DraftingViewProps {
  onCancel: () => void;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white shrink-0"
      title="Copy to clipboard"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
    </button>
  );
};

const DraftingView: React.FC<DraftingViewProps> = ({ onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<{ coverLetter: string; optimizedBullets: string[]; matchScore: number } | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const result = await generateDraft(
          "Frontend Engineer at Anthropic. Requires expertise in React, UI/UX design, and AI APIs. High attention to detail.",
          "Senior Frontend Developer with 5 years experience in React, TypeScript, and building SaaS applications."
        );
        setDraft(result);
      } catch (err) {
        console.error("Failed to generate draft", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDraft();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse pt-10">
        <div className="w-12 h-12 bg-white text-black rounded-full grid place-items-center">
          <svg className="animate-spin h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Drafting tailored application...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-tight text-white">AI Tailored Draft</h2>
        <div className="text-right">
           <span className="text-[9px] text-white/40 font-mono uppercase">Match Score</span>
           <div className="text-lg font-mono font-bold text-white">{draft?.matchScore}%</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[9px] font-mono text-white/40 uppercase block">Cover Letter Snippet</label>
            {draft?.coverLetter && <CopyButton text={draft.coverLetter} />}
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-xs leading-relaxed text-white/80 border border-white/10">
            {draft?.coverLetter}
          </div>
        </div>

        <div>
          <label className="text-[9px] font-mono text-white/40 uppercase mb-2 block">Optimized Experience Bullets</label>
          <ul className="space-y-3">
            {draft?.optimizedBullets.map((bullet, idx) => (
              <li key={idx} className="bg-white/5 p-3 rounded-xl text-xs text-white/80 border border-white/10 flex items-start gap-3 group">
                <span className="text-white font-bold shrink-0 mt-0.5">•</span>
                <span className="flex-1">{bullet}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={bullet} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 pt-4">
          <button className="flex-1 bg-white text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/10">
            Submit Application
          </button>
          <button 
            onClick={onCancel}
            className="px-6 border border-white/10 py-3 rounded-full font-bold text-xs uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftingView;
