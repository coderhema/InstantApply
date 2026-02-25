
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
          <div className="w-11 h-11 bg-white/10 text-white/40 rounded-full grid place-items-center border border-white/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 bg-white text-black rounded-full grid place-items-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-[-45deg]">
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
        <div key={app.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] p-1 -mx-1 rounded-lg transition-colors">
          <div className="flex items-center gap-4">
            {getIcon(app.status)}
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white uppercase tracking-tight">{app.company}</span>
              <span className="font-mono text-[10px] text-white/40 leading-none mt-0.5">{app.role} • {app.timestamp}</span>
            </div>
          </div>
          <div className={`
            px-3 py-1 rounded-full font-mono text-[10px] font-bold border
            ${app.status === ApplicationStatus.SENT ? 'bg-white text-black border-white' : ''}
            ${app.status === ApplicationStatus.VIEWED ? 'bg-white/5 text-white border-white/20' : ''}
            ${app.status === ApplicationStatus.REJECTED ? 'bg-transparent text-white/20 border-white/10' : ''}
          `}>
            {app.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationHistory;
