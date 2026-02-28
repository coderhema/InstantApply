
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {recommendations.map(rec => (
        <div key={rec.id} className="relative bg-bg-input rounded-2xl p-4 h-[140px] flex flex-col justify-between overflow-hidden shadow-sm border border-border-subtle hover:border-border-strong transition-all cursor-pointer group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`
              self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
              ${rec.badge === 'New' ? 'bg-white text-black' : 'bg-transparent text-text-primary border border-border-subtle'}
            `}>
              {rec.badge}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tight text-text-primary group-hover:text-white transition-colors">{rec.company}</span>
              <span className="font-mono text-[9px] text-text-tertiary">{rec.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
