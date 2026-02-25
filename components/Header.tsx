
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="px-5 pt-8 pb-5 shrink-0">
      <div className="flex justify-between items-start mb-8">
        <button className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/5 transition-colors">
          <div className="w-4 h-[10px] flex flex-col justify-between">
            <span className="h-[1.5px] w-full bg-white"></span>
            <span className="h-[1.5px] w-full bg-white"></span>
            <span className="h-[1.5px] w-full bg-white"></span>
          </div>
        </button>
        <div className="bg-white/5 pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-2 text-[13px] border border-white/10 shadow-sm">
          <div className="w-6 h-6 bg-white text-black rounded-full grid place-items-center text-[10px] font-bold">JS</div>
          <span className="text-[11px] uppercase tracking-wider text-white font-extrabold">Profile</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-[11px] text-white/40 uppercase tracking-[0.05em] mb-1">Jobs Applied</div>
        <div className="font-mono text-2xl font-medium text-white">124</div>
      </div>
    </div>
  );
};

export default Header;
