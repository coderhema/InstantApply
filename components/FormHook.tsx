import React, { useState, useEffect, useCallback } from 'react';
import { groqService } from '../services/groqService';
import { parseService } from '../services/parseService';
import { UserProfile, FormFieldSuggestion } from '../types';
import { FaLightbulb, FaRobot, FaMagic, FaRocket, FaCopy, FaCheck, FaLink, FaAlignLeft, FaSync, FaInfoCircle, FaHeading } from 'react-icons/fa';

// Add global declaration for chrome to satisfy TypeScript compiler in extension context
declare const chrome: any;

interface FormHookProps {
  profile: UserProfile;
  onComplete: (title: string, url: string, suggestions: FormFieldSuggestion[], fillMode: 'local' | 'cloud') => void;
  savedState: {
    url: string;
    title: string;
    description: string;
    suggestions: FormFieldSuggestion[];
    context: string;
  };
  onSaveState: (newState: Partial<FormHookProps['savedState']>) => void;
}

const FormHook: React.FC<FormHookProps> = ({ profile, onComplete, savedState, onSaveState }) => {
  // Use props for initialization, but local state for inputs to avoid slow typing
  const [url, setLocalUrl] = useState(savedState.url);
  const [title, setLocalTitle] = useState(savedState.title);
  const [description, setLocalDescription] = useState(savedState.description);
  
  // Update parent state on debounced/blur or direct changes
  useEffect(() => {
    // Sync local state when savedState changes (e.g. initial load)
    if (savedState.url !== url) setLocalUrl(savedState.url);
    if (savedState.title !== title) setLocalTitle(savedState.title);
    if (savedState.description !== description) setLocalDescription(savedState.description);
  }, [savedState.url === "" && url === ""]); // Only reset if parent clears it

  const updateState = (key: string, value: any) => {
    onSaveState({ [key]: value });
  };

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FormFieldSuggestion[]>(savedState.suggestions);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [wasAutoDetected, setWasAutoDetected] = useState(false);
  const [fillMode, setFillMode] = useState<'local' | 'cloud'>('local');

  // Sync suggestions to parent when they change
  useEffect(() => {
    if (suggestions !== savedState.suggestions) {
       updateState('suggestions', suggestions);
    }
  }, [suggestions]);

  const handleScrape = useCallback(async (targetUrl?: string) => {
    // If targetUrl is provided, use it; otherwise use the current state url
    const urlToScrape = targetUrl || url;
    if (!urlToScrape) return;

    setIsScraping(true);
    
    // Check if we are in an extension environment
    const isExtension = typeof chrome !== 'undefined' && chrome.tabs;

    try {
      // Use Parse.bot service instead of content script
      const scrapedData = await parseService.runScraper(urlToScrape);

      // Provide visual feedback and set data
      if (scrapedData) {
        // Handle both generic scraper responses and the specialized extract_form_fields response
        const dataToProcess = Array.isArray(scrapedData) ? scrapedData[0] : scrapedData;
        
        let contextString = '';
        
        // If it's the specialized "extract_form_fields" response with a fields array
          if (dataToProcess && dataToProcess.fields && Array.isArray(dataToProcess.fields)) {
            contextString = dataToProcess.fields
              .map((f: any, idx: number) => {
                // Construct a rich context string so the AI can infer meaning from any available attribute
                const parts = [];
                if (f.label) parts.push(`Label: "${f.label}"`);
                if (f.placeholder) parts.push(`Placeholder: "${f.placeholder}"`);
                if (f.name) parts.push(`Name: "${f.name}"`);
                if (f.id) parts.push(`ID: "${f.id}"`);
                if (f.type) parts.push(`Type: "${f.type}"`);
                if (f.options && Array.isArray(f.options) && f.options.length > 0) {
                  const optionsStr = f.options.map((o: any) => typeof o === 'string' ? `"${o}"` : `"${o.label || o.value}"`).join(', ');
                  parts.push(`Options: [${optionsStr}]`);
                }
                
                // Fallback identifier if absolutely nothing semantic is found
                if (parts.length === 0 || (parts.length === 1 && f.type)) {
                   parts.push(`Field #${idx + 1}`);
                }

                return `{ ${parts.join(', ')} }`;
              })
              .join('\n');
          
          if (!title && dataToProcess.form_id) {
            const newTitle = dataToProcess.form_id.replace(/-/g, ' ');
            setLocalTitle(newTitle);
            updateState('title', newTitle);
          }
        } else {
          // Fallback to generic JSON or string
          contextString = typeof dataToProcess === 'string'
            ? dataToProcess
            : JSON.stringify(dataToProcess, null, 2);
        }

        setLocalDescription(contextString);
        updateState('description', contextString);

        // Try to extract title from scraped data if available
        if (dataToProcess && dataToProcess.title) {
          setLocalTitle(dataToProcess.title);
          updateState('title', dataToProcess.title);
          setWasAutoDetected(true);
        } else if (isExtension) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            const activeTab = tabs[0];
            if (!title && activeTab?.title) {
              setLocalTitle(activeTab.title);
              updateState('title', activeTab.title);
              setWasAutoDetected(true);
            }
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Scraping failed:", error);
    } finally {
      setIsScraping(false);
    }
    return false;
  }, [url, title, description]);

  // Handle URL change with auto-detect logic
  const handleUrlChange = async (newUrl: string) => {
    setLocalUrl(newUrl);
    updateState('url', newUrl);
    
    // Check if it's a valid Google Form URL (basic check)
    if (newUrl.includes('docs.google.com/forms')) {
      const success = await handleScrape(newUrl);
      if (success) {
        // Automatically trigger AI drafting if scraping was successful
        handleHook();
      }
    }
  };

  // Auto-detect current tab and scrape on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (tabs[0]?.url) {
          const tabUrl = tabs[0].url;
          setLocalUrl(tabUrl);
          updateState('url', tabUrl);
          // Trigger automatic scrape once URL is identified
          handleScrape(tabUrl);
        }
      });
    }
  }, []); // Remove handleScrape dependency to avoid infinite loops


  const handleHook = async () => {
    // If description is still empty, we can't do anything
    if (!description.trim()) {
      // If we have a URL but no description, try one last scrape
      if (url) {
        await handleScrape(url);
      }
      if (!description.trim()) return;
    }

    setLoading(true);
    try {
      const results = await groqService.suggestFormResponses(profile, description);
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

  /* Removed isWriting state and overlay logic as simulation moved to App/FormDetail */

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... header ... */}
      <div className="border-b border-slate-100 dark:border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Active Engine</h2>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium">Capture form data and generate high-intent hooks.</p>
        </div>
        <button
          onClick={() => handleScrape()}
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
                    <span className="animate-pulse"><FaMagic size={8} /></span> Auto-Detected
                  </span>
                )}
              </label>
              <input
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-bold dark:text-zinc-100"
                placeholder="Give this hook a name..."
                value={title}
                onChange={(e) => {
                  setLocalTitle(e.target.value);
                  updateState('title', e.target.value);
                  setWasAutoDetected(false);
                }}
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-indigo-500">
                <span className="group-hover:animate-bounce"><FaLink size={10} /></span> Target URL
              </label>
              <input
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-medium dark:text-zinc-100 opacity-80"
                placeholder="URL of the form..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-indigo-500">
                <span className="group-hover:scale-x-125 transition-transform"><FaAlignLeft size={10} /></span> Scraped Context
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none leading-relaxed dark:text-zinc-100"
                placeholder="Context scraped from active page..."
                value={description}
                onChange={(e) => {
                  setLocalDescription(e.target.value);
                  updateState('description', e.target.value);
                }}
              />
            </div>
          </div>

          <button
            onClick={handleHook}
            disabled={loading || !description}
            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 group overflow-hidden ${loading
              ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-xl shadow-zinc-100 dark:shadow-none disabled:opacity-50'
              }`}
          >
            {loading ? <span className="animate-bounce"><FaRobot /></span> : <span className="group-hover:rotate-12 transition-transform group-hover:animate-pulse-soft"><FaMagic /></span>}
            <span>{loading ? 'Synthesizing...' : 'Draft AI Responses'}</span>
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-3xl border border-slate-200/60 dark:border-zinc-800/60 p-1 flex flex-col h-[520px]">
            <div className="p-4 flex items-center justify-between border-b border-white dark:border-zinc-900/50">
              <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="text-amber-500 animate-pulse-soft"><FaLightbulb /></span> AI Payload
              </h3>
              {suggestions.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-slate-200 dark:border-zinc-800">
                    <button
                      onClick={() => setFillMode('local')}
                      className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${fillMode === 'local' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-400'}`}
                      title="Run inside your browser (Best for Logins)"
                    >
                      LOCAL
                    </button>
                    <button
                      onClick={() => setFillMode('cloud')}
                      className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${fillMode === 'cloud' ? 'bg-white dark:bg-zinc-800 text-sky-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-400'}`}
                      title="Run via Parse.bot Cloud"
                    >
                      CLOUD
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const finalTitle = title || url.split('/').pop()?.substring(0, 20) || "Untitled Hook";
                      onComplete(finalTitle, url, suggestions, fillMode);
                      // Reset state for next hook
                      setLocalUrl('');
                      setLocalTitle('');
                      setLocalDescription('');
                      setSuggestions([]);
                      updateState('url', '');
                      updateState('title', '');
                      updateState('description', '');
                      updateState('suggestions', []);
                      setWasAutoDetected(false);
                    }}
                    className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Confirm Hook
                  </button>
                </div>
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
                        {copiedIndex === idx ? <span className="text-emerald-500 animate-in zoom-in duration-300"><FaCheck /></span> : <span className="group-hover/copy:scale-110 transition-transform"><FaCopy size={12} /></span>}
                      </button>
                    </div>

                    {editingIndex === idx ? (
                      <textarea
                        autoFocus
                        value={s.suggestedValue}
                        onChange={(e) => {
                          const newSuggestions = [...suggestions];
                          newSuggestions[idx] = { ...newSuggestions[idx], suggestedValue: e.target.value };
                          setSuggestions(newSuggestions);
                        }}
                        onBlur={() => setEditingIndex(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setEditingIndex(null);
                          }
                        }}
                        className="w-full text-[14px] text-zinc-900 dark:text-zinc-100 leading-relaxed font-medium bg-white dark:bg-zinc-950 p-3 rounded-xl border-2 border-indigo-500/50 outline-none resize-none animate-in fade-in duration-200"
                        rows={3}
                      />
                    ) : (
                      <p 
                        onDoubleClick={() => setEditingIndex(idx)}
                        className="text-[14px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium bg-slate-50/50 dark:bg-zinc-950/30 p-3 rounded-xl border border-slate-50 dark:border-zinc-800/50 cursor-text hover:bg-slate-100 dark:hover:bg-zinc-900/50 transition-colors border-dashed hover:border-indigo-300/30"
                        title="Double-click to edit"
                      >
                        "{s.suggestedValue}"
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/50 flex items-center gap-2 min-w-0">
                      <span className="text-slate-300 dark:text-zinc-700 animate-pulse-soft flex-shrink-0">
                        <FaRobot size={10} />
                      </span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic truncate group-hover/card:text-slate-500 dark:group-hover/card:text-zinc-400 transition-colors">
                        Drafted using "{profile.writingStyle}" profile.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in fade-in duration-700">
                  <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-slate-200 dark:text-zinc-800 text-2xl shadow-sm mb-4 border border-slate-100 dark:border-zinc-800 group cursor-default">
                    <span className="group-hover:animate-pulse-soft transition-all"><FaMagic /></span>
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
