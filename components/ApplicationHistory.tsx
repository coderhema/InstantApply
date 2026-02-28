
import React from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { Minus, ArrowUpRight } from 'iconoir-react';

interface ApplicationHistoryProps {
  applications: JobApplication[];
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applications }) => {
  const getIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.REJECTED:
        return (
          <div className="w-11 h-11 bg-bg-input text-text-tertiary rounded-full grid place-items-center border border-border-subtle">
            <Minus className="w-4 h-4" strokeWidth={3} />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 bg-white text-black rounded-full grid place-items-center shadow-lg">
            <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="flex items-center justify-between group cursor-pointer hover:bg-bg-input p-1 -mx-1 rounded-lg transition-colors">
          <div className="flex items-center gap-4">
            {getIcon(app.status)}
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-text-primary uppercase tracking-tight">{app.company}</span>
              <span className="font-mono text-[10px] text-text-tertiary leading-none mt-0.5">{app.role} • {app.timestamp}</span>
            </div>
          </div>
          <div className={`
            px-3 py-1 rounded-full font-mono text-[10px] font-bold border
            ${app.status === ApplicationStatus.SENT ? 'bg-white text-black border-white' : ''}
            ${app.status === ApplicationStatus.VIEWED ? 'bg-bg-input text-text-secondary border-border-subtle' : ''}
            ${app.status === ApplicationStatus.REJECTED ? 'bg-transparent text-text-tertiary border-border-subtle' : ''}
          `}>
            {app.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationHistory;
