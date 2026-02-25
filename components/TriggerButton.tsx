
import React from 'react';

interface TriggerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const TriggerButton: React.FC<TriggerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        relative w-14 h-14 bg-white text-black flex items-center justify-center 
        shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:scale-105 active:scale-95 rounded-full
        ${isOpen ? 'rotate-45' : 'rotate-0'}
      `}
    >
      <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-white rounded-full border-2 border-[#0A0A0A] grid place-items-center text-[9px] font-bold text-black">
        1
      </div>
      <svg 
        width="24" height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
};

export default TriggerButton;
