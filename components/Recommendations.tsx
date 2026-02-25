
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {recommendations.map(rec => (
        <div key={rec.id} className="relative bg-[#1A1A1A] rounded-2xl p-3 h-[140px] flex flex-col justify-between overflow-hidden shadow-sm border border-white/5 hover:-translate-y-0.5 transition-transform cursor-pointer">
          <div className="absolute inset-0 bg-white/5 opacity-50 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`
              self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase
              ${rec.badge === 'New' ? 'bg-white text-black' : 'bg-transparent text-white border border-white/40'}
            `}>
              {rec.badge}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tight text-white">{rec.company}</span>
              <span className="font-mono text-[9px] text-white/40">{rec.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
