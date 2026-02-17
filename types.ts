
export enum ApplicationStatus {
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  REJECTED = 'REJECTED',
  DRAFTING = 'DRAFTING'
}

export enum TabType {
  HISTORY = 'HISTORY',
  AUTO_APPLY = 'AUTO-APPLY',
  SETTINGS = 'SETTINGS'
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  timestamp: string;
  status: ApplicationStatus;
  logoColor?: string;
}

export interface Recommendation {
  id: string;
  company: string;
  location: string;
  badge?: string;
}
