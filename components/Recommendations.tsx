
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {recommendations.map(rec => (
        <div key={rec.id} className="relative bg-white rounded-2xl p-3 h-[140px] flex flex-col justify-between overflow-hidden shadow-sm border border-black/5 hover:-translate-y-0.5 transition-transform cursor-pointer">
          <div className="absolute inset-0 bg-[#F5F5F5] opacity-50 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`
              self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase
              ${rec.badge === 'New' ? 'bg-accent-black text-white' : 'bg-transparent text-black border border-black'}
            `}>
              {rec.badge}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tight">{rec.company}</span>
              <span className="font-mono text-[9px] text-[#8C8C8C]">{rec.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
