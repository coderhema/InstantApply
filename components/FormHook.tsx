
import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { UserProfile, FormFieldSuggestion } from '../types';
import { FaLightbulb, FaRobot, FaMagic, FaRocket, FaCopy, FaCheck, FaLink, FaAlignLeft, FaSync, FaInfoCircle, FaHeading } from 'react-icons/fa';

// Add global declaration for chrome to satisfy TypeScript compiler in extension context
declare const chrome: any;

interface FormHookProps {
  profile: UserProfile;
  onComplete: (title: string, url: string) => void;
}

const FormHook: React.FC<FormHookProps> = ({ profile, onComplete }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FormFieldSuggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [wasAutoDetected, setWasAutoDetected] = useState(false);

  const handleScrape = useCallback(() => {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;
    
    setIsScraping(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'SCRAPE_FORM_CONTEXT' }, (response) => {
          if (response) {
            if (response.title && !title) {
              setTitle(response.title);
              setWasAutoDetected(true);
            }
            if (response.context) {
              setDescription(response.context);
            }
          }
          setIsScraping(false);
        });
      } else {
        setIsScraping(false);
      }
    });
  }, [title]);

  // Auto-detect current tab and scrape on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setUrl(tabs[0].url);
          // Trigger automatic scrape once URL is identified
          handleScrape();
        }
      });
    }
  }, [handleScrape]);

  const handleHook = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const results = await geminiService.suggestFormResponses(profile, description);
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-slate-100 dark:border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Active Engine</h2>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium">Capture form data and generate high-intent hooks.</p>
        </div>
        <button 
          onClick={handleScrape}
          disabled={isScraping}
          className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-100 transition-all active:scale-95 group disabled:opacity-50"
        >
          <FaSync size={12} className={`group-hover:animate-spin ${isScraping ? 'animate-spin' : ''}`} /> 
          {isScraping ? 'Syncing...' : 'Resync Workspace'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
             {/* Form Title Field */}
             <div className="space-y-1.5 group">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest flex items-center justify-between transition-colors group-focus-within:text-indigo-500">
                   <div className="flex items-center gap-2">
                    <FaHeading size={10} className="group-hover:scale-110 transition-transform" /> Form Title
                   </div>
                   {wasAutoDetected && (
                     <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 animate-in slide-in-from-right-2">
                       <FaMagic size={8} className="animate-pulse" /> Auto-Detected
                     </span>
                   )}
                </label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-bold dark:text-zinc-100"
                  placeholder="Give this hook a name..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setWasAutoDetected(false);
                  }}
                />
             </div>

             <div className="space-y-1.5 group">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-indigo-500">
                   <FaLink size={10} className="group-hover:animate-bounce" /> Target URL
                </label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-medium dark:text-zinc-100 opacity-80"
                  placeholder="URL of the form..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
             </div>
             
             <div className="space-y-1.5 group">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-indigo-500">
                   <FaAlignLeft size={10} className="group-hover:scale-x-125 transition-transform" /> Scraped Context
                </label>
                <textarea 
                  rows={8}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none leading-relaxed dark:text-zinc-100"
                  placeholder="Context scraped from active page..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>
          </div>

          <button 
            onClick={handleHook}
            disabled={loading || !description}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 group overflow-hidden ${
              loading 
                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed' 
                : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-xl shadow-zinc-100 dark:shadow-none disabled:opacity-50'
            }`}
          >
            {loading ? <FaRobot className="animate-bounce" /> : <FaMagic className="group-hover:rotate-12 transition-transform group-hover:animate-pulse-soft" />}
            <span>{loading ? 'Synthesizing...' : 'Draft AI Responses'}</span>
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 p-1 flex flex-col h-[520px]">
            <div className="p-4 flex items-center justify-between border-b border-white dark:border-zinc-900/50">
              <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FaLightbulb className="text-amber-500 animate-pulse-soft" /> AI Payload
              </h3>
              {suggestions.length > 0 && (
                <button 
                  onClick={() => onComplete(title || url.split('/').pop()?.substring(0, 20) || "Untitled Hook", url)}
                  className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg transition-all"
                >
                  Confirm Hook
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {suggestions.length > 0 ? (
                suggestions.map((s, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm animate-in zoom-in-95 duration-300 relative group/card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase tracking-widest cursor-default">
                          {s.label}
                        </span>
                        
                        {/* Interactive Reasoning Info Tooltip */}
                        <div className="relative">
                          <button 
                            onMouseEnter={() => setActiveTooltip(idx)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="text-slate-300 dark:text-zinc-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95"
                          >
                            <FaInfoCircle size={14} />
                          </button>
                          
                          {activeTooltip === idx && (
                            <div className="absolute z-50 left-0 top-6 w-64 p-3 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-slate-100 dark:border-zinc-700 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <FaRobot size={10} /> AI Logic
                              </p>
                              <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                                {s.reasoning}
                              </p>
                              <div className="absolute -top-1 left-3 w-2 h-2 bg-white dark:bg-zinc-800 border-l border-t border-slate-100 dark:border-zinc-700 rotate-45" />
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        className="text-slate-300 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all p-1 group/copy"
                        onClick={() => copyToClipboard(s.suggestedValue, idx)}
                      >
                        {copiedIndex === idx ? <FaCheck className="text-emerald-500 animate-in zoom-in duration-300" /> : <FaCopy size={12} className="group-hover/copy:scale-110 transition-transform" />}
                      </button>
                    </div>
                    
                    <p className="text-[14px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium bg-slate-50/50 dark:bg-zinc-950/30 p-3 rounded-xl border border-slate-50 dark:border-zinc-800/50">
                      "{s.suggestedValue}"
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/50 flex items-center gap-2">
                      <FaRobot size={10} className="text-slate-300 dark:text-zinc-700 animate-pulse-soft" />
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic truncate group-hover/card:text-slate-500 dark:group-hover/card:text-zinc-400 transition-colors">
                        Drafted using "{profile.writingStyle}" profile.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in fade-in duration-700">
                   <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-slate-200 dark:text-zinc-800 text-2xl shadow-sm mb-4 border border-slate-100 dark:border-zinc-800 group cursor-default">
                      <FaMagic className="group-hover:animate-pulse-soft transition-all" />
                   </div>
                   <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Intelligence Standby</h4>
                   <p className="text-[12px] text-slate-400 dark:text-zinc-600 mt-1 max-w-[200px]">Waiting for form context to initiate AI drafting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHook;
