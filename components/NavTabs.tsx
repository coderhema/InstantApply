
import React from 'react';
import { TabType } from '../types';

interface NavTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = Object.values(TabType);

  return (
    <div className="flex gap-6 px-6 mb-4 border-b border-transparent">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            text-[11px] uppercase tracking-widest pb-1 border-b transition-all duration-200 font-bold
            ${activeTab === tab 
              ? 'text-text-primary border-text-primary' 
              : 'text-text-tertiary border-transparent hover:text-text-secondary'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NavTabs;
