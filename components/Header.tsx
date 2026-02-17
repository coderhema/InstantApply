
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="px-5 pt-8 pb-5 shrink-0">
      <div className="flex justify-between items-start mb-8">
        <button className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/5 transition-colors">
          <div className="w-4 h-[10px] flex flex-col justify-between">
            <span className="h-[1.5px] w-full bg-accent-black"></span>
            <span className="h-[1.5px] w-full bg-accent-black"></span>
            <span className="h-[1.5px] w-full bg-accent-black"></span>
          </div>
        </button>
        <div className="bg-white pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-2 text-[13px] border border-black/10 shadow-sm">
          <div className="w-6 h-6 bg-black text-white rounded-full grid place-items-center text-[10px] font-bold">JS</div>
          <span className="text-[11px] uppercase tracking-wider text-black font-extrabold">Profile</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-[11px] text-[#8C8C8C] uppercase tracking-[0.05em] mb-1">Jobs Applied</div>
        <div className="font-mono text-2xl font-medium text-accent-black">124</div>
      </div>
    </div>
  );
};

export default Header;
