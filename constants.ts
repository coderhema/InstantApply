
import { UserProfile, FormStatus } from './types';

export const INITIAL_PROFILE: UserProfile = {
  fullName: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Innovation Drive, San Francisco, CA',
  bio: 'Product Designer and Frontend Engineer with 6 years of experience in SaaS and Fintech.',
  experience: 'Senior Designer at TechFlow, Founder of UIUX Lab.',
  writingStyle: 'Professional yet friendly, concise but thorough, focusing on value proposition.'
};

export const MOCK_FORMS = [
  {
    id: '1',
    title: 'Google Design Challenge 2024',
    url: 'https://forms.gle/xyz123',
    status: FormStatus.FILLED,
    createdAt: Date.now() - 86400000,
    aiResponse: 'Successfully generated high-intent responses for 12 fields.'
  },
  {
    id: '2',
    title: 'Startup Accelerator Intake',
    url: 'https://typeform.com/abc',
    status: FormStatus.PENDING,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '3',
    title: 'Y-Combinator W25 Application',
    url: 'https://ycombinator.com/apply',
    status: FormStatus.ERROR,
    createdAt: Date.now() - 172800000,
    errorMessage: 'CORS policy blocked direct access. Content must be pasted manually.'
  }
];
