import React, { useMemo } from 'react';
import { FormEntry, FormStatus } from '../types';
import { FaArrowLeft, FaCheckCircle, FaRobot, FaPenFancy, FaGlobe, FaCalendarAlt, FaCircleNotch } from 'react-icons/fa';

interface FormDetailProps {
  form: FormEntry;
  onBack: () => void;
}

const FormDetail: React.FC<FormDetailProps> = ({ form, onBack }) => {
  // Determine if a step is completed based on current status
  const getStepStatus = (stepId: 'scrape' | 'analyze' | 'fill') => {
    switch (stepId) {
      case 'scrape':
        return [FormStatus.SCRAPED, FormStatus.ANALYZED, FormStatus.FILLED, FormStatus.CLOSED].includes(form.status);
      case 'analyze':
        return [FormStatus.ANALYZED, FormStatus.FILLED, FormStatus.CLOSED].includes(form.status);
      case 'fill':
        return [FormStatus.FILLED, FormStatus.CLOSED].includes(form.status);
      default:
        return false;
    }
  };

  const steps = [
    { 
      id: 'scrape', 
      label: 'Scraping Content', 
      icon: <FaGlobe />, 
      isCompleted: getStepStatus('scrape'),
      subtext: 'Extracting form fields'
    },
    { 
      id: 'analyze', 
      label: 'AI Analysis', 
      icon: <FaRobot />, 
      isCompleted: getStepStatus('analyze'),
      subtext: 'Generating responses'
    },
    { 
      id: 'fill', 
      label: 'Form Filling', 
      icon: <FaPenFancy />, 
      isCompleted: getStepStatus('fill'),
      subtext: 'Applying data'
    },
  ];

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <FaArrowLeft />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-lg">{form.title}</h1>
           <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium font-mono">{form.id}</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Status & Visuals */}
        <div className="lg:col-span-2 space-y-6">
           {/* Celebration / Status Card */}
           <div className={`relative overflow-hidden rounded-3xl p-8 flex items-center justify-center min-h-[200px] transition-all duration-500 ${
             form.status === FormStatus.FILLED || form.status === FormStatus.CLOSED
               ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20' 
               : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'
           }`}>
             {form.status === FormStatus.FILLED || form.status === FormStatus.CLOSED ? (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className="text-7xl mb-4 filter drop-shadow-md">🎉</div>
                  <h2 className="text-2xl font-black tracking-tight">Success!</h2>
                  <p className="text-white/80 font-medium">Form has been populated.</p>
                </div>
             ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-indigo-500 animate-pulse">
                    <FaCircleNotch size={24} className="animate-spin" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-4">Processing...</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Agent is working on your request.</p>
                </div>
             )}
           </div>

           {/* Steps Timeline */}
           <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8">
              <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-8">Execution Timeline</h3>
              <div className="space-y-8 relative">
                 {/* Connecting Line */}
                 <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-zinc-800" />
                 
                 {steps.map((step) => (
                   <div key={step.id} className="relative flex items-start gap-4 group">
                     <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-sm z-10 transition-all duration-500 border-4 border-white dark:border-zinc-900 ${
                       step.isCompleted 
                         ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-100' 
                         : 'bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600'
                     }`}>
                       {step.isCompleted ? <FaCheckCircle /> : step.icon}
                     </div>
                     <div className={`transition-opacity duration-500 ${step.isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                       <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{step.label}</h4>
                       <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">{step.isCompleted ? 'Completed' : step.subtext}</p>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Target URL</h3>
                <a 
                  href={form.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                >
                  {form.url}
                </a>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Processed On</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                   <FaCalendarAlt className="text-slate-400" />
                   {new Date(form.createdAt).toLocaleString()}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetail;
