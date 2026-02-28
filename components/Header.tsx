
import React from 'react';
import { Menu } from 'iconoir-react';

const Header: React.FC = () => {
  return (
    <div className="px-6 pt-8 pb-5 shrink-0">
      <div className="flex justify-between items-start mb-8">
        <button className="w-8 h-8 grid place-items-center rounded-full hover:bg-bg-input transition-colors">
          <Menu className="w-5 h-5 text-text-primary" />
        </button>
        <div className="bg-bg-input pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-2 text-[13px] border border-border-subtle shadow-sm">
          <div className="w-6 h-6 bg-white text-black rounded-full grid place-items-center text-[10px] font-bold">JS</div>
          <span className="text-[11px] uppercase tracking-wider text-text-primary font-extrabold">Profile</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-[11px] text-text-tertiary uppercase tracking-[0.05em] mb-1 font-bold">Jobs Applied</div>
        <div className="font-mono text-2xl font-medium text-text-primary">124</div>
      </div>
    </div>
  );
};

export default Header;
