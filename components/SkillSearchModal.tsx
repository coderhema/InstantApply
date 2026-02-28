import React, { useState, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  Xmark as XIcon, 
  Code as CodeIcon,
  Globe as GlobeIcon,
  Cpu as CpuIcon,
  Database as DatabaseIcon,
  ViewGrid as LayoutIcon
} from 'iconoir-react';

interface Skill {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const MOCK_SKILLS: Skill[] = [
  { name: 'React.js', category: 'Frontend', icon: <LayoutIcon className="w-3.5 h-3.5" /> },
  { name: 'TypeScript', category: 'Language', icon: <CodeIcon className="w-3.5 h-3.5" /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <LayoutIcon className="w-3.5 h-3.5" /> },
  { name: 'Node.js', category: 'Backend', icon: <CodeIcon className="w-3.5 h-3.5" /> },
  { name: 'Gemini API', category: 'AI', icon: <CpuIcon className="w-3.5 h-3.5" /> },
  { name: 'PostgreSQL', category: 'Database', icon: <DatabaseIcon className="w-3.5 h-3.5" /> },
  { name: 'Docker', category: 'DevOps', icon: <CodeIcon className="w-3.5 h-3.5" /> },
  { name: 'GraphQL', category: 'API', icon: <GlobeIcon className="w-3.5 h-3.5" /> },
  { name: 'Python', category: 'Language', icon: <CodeIcon className="w-3.5 h-3.5" /> },
  { name: 'Next.js', category: 'Frontend', icon: <LayoutIcon className="w-3.5 h-3.5" /> },
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-panel w-full max-w-md rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-border-strong overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-input">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black grid place-items-center shadow-lg">
              <SearchIcon className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-text-primary">Skill Database</h3>
              <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">IAAI Skills Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/5 grid place-items-center transition-colors text-text-tertiary hover:text-text-primary"
          >
            <XIcon className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search skills (e.g. React, AI, Database)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-input border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-xs font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-active transition-all"
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
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-bg-input transition-all group border border-transparent hover:border-border-subtle"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-bg-input text-text-tertiary group-hover:bg-white group-hover:text-black grid place-items-center transition-all border border-border-subtle group-hover:border-white">
                      {skill.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-text-primary">{skill.name}</div>
                      <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{skill.category}</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full shadow-sm">Select</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs text-text-tertiary font-mono">No matching skills found in database.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-bg-input border-t border-border-subtle flex justify-between items-center">
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Source: skills.sh</span>
          <button 
            onClick={onClose}
            className="text-[10px] font-bold uppercase tracking-widest hover:text-text-primary text-text-tertiary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSearchModal;
