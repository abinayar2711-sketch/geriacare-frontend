export interface Question {
    id: string;
    name: string;
    city: string;
    relation: string;
    phone?: string;
    content: string;
    status: 'pending' | 'answered';
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuestionInput {
    name: string;
    city: string;
    relation: string;
    phone?: string;
    content: string;
    phoneConsent?: boolean;
}

export interface Message {
    id: string;
    questionId: string;
    content: string;
    sender: 'user' | 'admin';
    createdAt: string;
}

export interface Insight {
    id: string;
    title: string;
    content: string;
    category: string;
    excerpt: string;
    publishedAt: string;
    author: string;
}

export interface Caregiver {
    id: string;
    name: string;
    photo?: string;
    experience: number;
    city: string;
    languages: string[];
    skills: string[];
    availability: 'available' | 'busy' | 'unavailable';
    contactInfo: string;
    verified: boolean;
}

export interface Feedback {
    id: string;
    name: string;
    email?: string;
    feedbackType: string;
    message: string;
    rating?: number;
    createdAt: string;
}

export interface CreateFeedbackInput {
    name: string;
    email?: string;
    feedbackType: string;
    message: string;
    rating?: number;
}

export interface CreateInsightInput {
    title: string;
    content: string;
    category: string;
    excerpt: string;
    author: string;
}

export interface UpdateInsightInput {
    title?: string;
    content?: string;
    category?: string;
    excerpt?: string;
    author?: string;
}

export interface CreateCaregiverInput {
    name: string;
    photo?: string;
    experience: number;
    city: string;
    languages: string[];
    skills: string[];
    availability: 'available' | 'busy' | 'unavailable';
    contactInfo: string;
    verified?: boolean;
}

export interface UpdateCaregiverInput {
    name?: string;
    photo?: string;
    experience?: number;
    city?: string;
    languages?: string[];
    skills?: string[];
    availability?: 'available' | 'busy' | 'unavailable';
    contactInfo?: string;
    verified?: boolean;
}

export interface ContactInquiry {
    name: string;
    email?: string;
    phone?: string;
    message: string;
}

export interface AdminStats {
    totalQuestions: number;
    pendingQuestions: number;
    answeredQuestions: number;
    totalInsights: number;
    totalCaregivers: number;
    activeCaregivers: number;
    totalFeedback: number;
}

export const RELATION_OPTIONS = [
    'Son/Daughter',
    'Spouse',
    'Grandchild',
    'Sibling',
    'Friend',
    'Neighbor',
    'Caregiver',
    'Other'
] as const;

export const INSIGHT_CATEGORIES = [
    'Food & Nutrition',
    'Bathing & Hygiene',
    'Daily Routine',
    'Emotional Wellbeing',
    'General Care'
] as const;

export const FEEDBACK_TYPES = [
    'General Feedback',
    'Website Issues',
    'Content Suggestion',
    'Service Inquiry',
    'Complaint',
    'Appreciation'
] as const;

export type RelationOption = (typeof RELATION_OPTIONS)[number];
export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
