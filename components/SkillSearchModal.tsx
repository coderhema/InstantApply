import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Code, Terminal, Globe, Cpu, Database, Layout } from 'lucide-react';

interface Skill {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const MOCK_SKILLS: Skill[] = [
  { name: 'React.js', category: 'Frontend', icon: <Layout size={14} /> },
  { name: 'TypeScript', category: 'Language', icon: <Code size={14} /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <Layout size={14} /> },
  { name: 'Node.js', category: 'Backend', icon: <Terminal size={14} /> },
  { name: 'Gemini API', category: 'AI', icon: <Cpu size={14} /> },
  { name: 'PostgreSQL', category: 'Database', icon: <Database size={14} /> },
  { name: 'Docker', category: 'DevOps', icon: <Terminal size={14} /> },
  { name: 'GraphQL', category: 'API', icon: <Globe size={14} /> },
  { name: 'Python', category: 'Language', icon: <Code size={14} /> },
  { name: 'Next.js', category: 'Frontend', icon: <Layout size={14} /> },
];

interface SkillSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skillName: string) => void;
}

const SkillSearchModal: React.FC<SkillSearchModalProps> = ({ isOpen, onClose, onSelectSkill }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSkills = MOCK_SKILLS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-black grid place-items-center">
              <Search size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-tight text-white">Skill Database</h3>
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">IAAI Skills Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/5 grid place-items-center transition-colors text-white/40 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search skills (e.g. React, AI, Database)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/5 transition-all"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => {
                    onSelectSkill(skill.name);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-white/40 group-hover:bg-white group-hover:text-black grid place-items-center transition-all">
                      {skill.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">{skill.name}</div>
                      <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{skill.category}</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[9px] font-bold uppercase tracking-widest bg-white/10 text-white px-2 py-1 rounded-md">Select</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs text-white/20 font-mono">No matching skills found in database.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Source: skills.sh</span>
          <button 
            onClick={onClose}
            className="text-[9px] font-bold uppercase tracking-widest hover:underline text-white/40 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSearchModal;
