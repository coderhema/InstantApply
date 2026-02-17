
import React from 'react';
import { TabType } from '../types';

interface NavTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = Object.values(TabType);

  return (
    <div className="flex gap-6 px-5 mb-4 border-b border-transparent">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            text-[11px] uppercase tracking-widest pb-1 border-b transition-all duration-200
            ${activeTab === tab 
              ? 'text-accent-black border-accent-black' 
              : 'text-[#8C8C8C] border-transparent hover:text-accent-black'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NavTabs;
