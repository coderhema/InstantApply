
export enum FormStatus {
  PENDING = 'PENDING',
  SCRAPED = 'SCRAPED',
  ANALYZED = 'ANALYZED',
  FILLED = 'FILLED',
  ERROR = 'ERROR',
  CLOSED = 'CLOSED'
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  experience: string;
  writingStyle: string;
  customFields?: { id: string; label: string; value: string }[];
}

export interface FormEntry {
  id: string;
  url: string;
  title: string;
  status: FormStatus;
  createdAt: number;
  aiResponse?: string;
  errorMessage?: string;
}

export interface FormFieldSuggestion {
  fieldName: string;
  label: string;
  suggestedValue: string;
  reasoning: string;
}
