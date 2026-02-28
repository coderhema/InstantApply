
import React from 'react';
import { Plus } from 'iconoir-react';

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
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
};

export default TriggerButton;
