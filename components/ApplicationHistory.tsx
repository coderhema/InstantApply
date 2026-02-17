
import React from 'react';
import { JobApplication, ApplicationStatus } from '../types';

interface ApplicationHistoryProps {
  applications: JobApplication[];
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applications }) => {
  const getIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.REJECTED:
        return (
          <div className="w-11 h-11 bg-black text-white rounded-full grid place-items-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 bg-white rounded-full border border-black/20 grid place-items-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" className="rotate-[-45deg]">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="flex items-center justify-between group cursor-pointer hover:bg-black/[0.02] p-1 -mx-1 rounded-lg transition-colors">
          <div className="flex items-center gap-4">
            {getIcon(app.status)}
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-black uppercase tracking-tight">{app.company}</span>
              <span className="font-mono text-[10px] text-gray-500 leading-none mt-0.5">{app.role} • {app.timestamp}</span>
            </div>
          </div>
          <div className={`
            px-3 py-1 rounded-full font-mono text-[10px] font-bold border
            ${app.status === ApplicationStatus.SENT ? 'bg-black text-white border-black' : ''}
            ${app.status === ApplicationStatus.VIEWED ? 'bg-white text-black border-black/20 shadow-sm' : ''}
            ${app.status === ApplicationStatus.REJECTED ? 'bg-gray-100 text-gray-400 border-transparent' : ''}
          `}>
            {app.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationHistory;
