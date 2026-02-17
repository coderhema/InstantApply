
import React, { useState, useEffect } from 'react';
import { TabType, ApplicationStatus, JobApplication, Recommendation } from './types';
import TriggerButton from './components/TriggerButton';
import AppPanel from './components/AppPanel';

const MOCK_HISTORY: JobApplication[] = [
  { id: '1', company: 'Linear', role: 'Product Designer', timestamp: '2h ago', status: ApplicationStatus.SENT },
  { id: '2', company: 'Vercel', role: 'Design Engineer', timestamp: '1d ago', status: ApplicationStatus.VIEWED },
  { id: '3', company: 'Stripe', role: 'UX Writer', timestamp: '3d ago', status: ApplicationStatus.REJECTED },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'r1', company: 'Airbnb', location: 'San Francisco', badge: 'New' },
  { id: 'r2', company: 'Notion', location: 'New York', badge: 'Match' },
];

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HISTORY);
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_HISTORY);
  const [recommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);

  const togglePanel = () => setIsOpen(prev => !prev);

  return (
    <div className="min-h-screen w-full relative">
      {/* Mock Host Page Backdrop - Adjusted for white background visibility */}
      <div className="absolute inset-0 p-5 grid grid-cols-[240px,1fr] gap-5 opacity-40 blur-[2px] pointer-events-none select-none">
        <div className="bg-gray-50 rounded-xl h-full shadow-sm border border-black/5"></div>
        <div className="bg-gray-50 rounded-xl h-full shadow-sm border border-black/5"></div>
      </div>

      {/* Floating Extension Overlay */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
        <AppPanel 
          isOpen={isOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          applications={applications}
          recommendations={recommendations}
        />
        <TriggerButton isOpen={isOpen} onClick={togglePanel} />
      </div>
    </div>
  );
};

export default App;
