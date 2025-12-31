
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { FaSave, FaPlus, FaTimes, FaMagic } from 'react-icons/fa';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const PRESET_CLIPS = [
  'Professional', 'Friendly', 'Concise', 'Witty', 'Direct', 
  'Academic', 'Empathetic', 'Minimalist', 'Authoritative', 'Persuasive'
];

const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [customTag, setCustomTag] = useState('');
  
  // Parse existing writingStyle string into an array of tags for internal UI
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    return profile.writingStyle
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTag.trim())) {
        setSelectedTags([...selectedTags, customTag.trim()]);
      }
      setCustomTag('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  // Keep formData.writingStyle in sync with our tag selection
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      writingStyle: selectedTags.join(', ')
    }));
  }, [selectedTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Visual feedback for save (would ideally use a toast component)
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
           My Profile
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-[13px] font-medium">This data acts as the core intelligence layer for the AI when drafting responses.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest px-1">Full Name</label>
            <input 
              className="w-full px-5 py-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all dark:text-zinc-100 font-medium"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest px-1">Email Address</label>
            <input 
              className="w-full px-5 py-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all dark:text-zinc-100 font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest px-1">Brief Bio</label>
          <textarea 
            rows={3}
            className="w-full px-5 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none dark:text-zinc-100 font-medium leading-relaxed"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          />
        </div>

        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest px-1">Detailed Experience</label>
          <textarea 
            rows={4}
            className="w-full px-5 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none dark:text-zinc-100 font-medium leading-relaxed"
            placeholder="Work history, special skills, and achievements..."
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
        </div>

        {/* Dynamic Writing Style Tags */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
             <label className="text-[11px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest px-1">Writing Style Hook</label>
             <p className="text-[12px] text-slate-400 dark:text-zinc-600 px-1">Define the AI persona using style clips.</p>
          </div>
          
          <div className="premium-card dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
            <div className="flex flex-wrap gap-2">
              {PRESET_CLIPS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all hover:scale-105 active:scale-95 ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-indigo-300 dark:hover:border-indigo-900'
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {/* Custom Tags rendering */}
              {selectedTags.filter(t => !PRESET_CLIPS.includes(t)).map(tag => (
                <div 
                  key={tag}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-zinc-900 dark:border-zinc-200 shadow-md flex items-center gap-2 group/tag animate-in zoom-in-90 duration-200"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white/50 dark:text-zinc-900/50 hover:text-white dark:hover:text-zinc-900 transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}

              <div className="relative group/input">
                <input 
                  className="px-4 py-2 bg-transparent border-b-2 border-slate-100 dark:border-zinc-800 focus:border-indigo-500 outline-none transition-all text-[12px] font-bold text-zinc-800 dark:text-zinc-200 w-32 focus:w-48 placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                  placeholder="+ Custom style..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={addCustomTag}
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl flex items-center justify-between border border-dashed border-slate-200 dark:border-zinc-800">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-zinc-800">
                    <FaMagic size={12} className="animate-pulse-soft" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Active Persona Preview</p>
                    <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 truncate italic">
                      {selectedTags.length > 0 ? selectedTags.join(' • ') : 'No style hooks selected yet.'}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button 
            type="submit"
            className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold py-4 px-12 rounded-2xl shadow-xl shadow-zinc-200 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95 hover-float"
          >
            <FaSave /> Update Agent Knowledge
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
