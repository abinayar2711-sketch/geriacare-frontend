import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockFeedback, mockInsights, mockCaregivers, mockAdminStats, mockQuestions } from '@/data/mockData';
import type {
    Feedback,
    Insight,
    Caregiver,
    AdminStats,
    CreateInsightInput,
    UpdateInsightInput,
    CreateCaregiverInput,
    UpdateCaregiverInput,
    Question
} from '@/types/geriacare';
import type { PaginatedResponse } from '@/types/api';

export const adminService = {
    // Admin Stats
    getStats: async (): Promise<AdminStats> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getAdminStats ---');
            await mockApiDelay();
            return mockAdminStats;
        }
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Feedback Management
    getFeedback: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Feedback>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getFeedback ---', { page, limit });
            await mockApiDelay();

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedFeedback = mockFeedback.slice(startIndex, endIndex);

            return {
                results: paginatedFeedback,
                page,
                limit,
                totalPages: Math.ceil(mockFeedback.length / limit),
                totalResults: mockFeedback.length
            };
        }
        const response = await api.get(`/admin/feedback?page=${page}&limit=${limit}`);
        return response.data;
    },

    deleteFeedback: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: deleteFeedback ---', { id });
            await mockApiDelay();
            return;
        }
        await api.delete(`/admin/feedback/${id}`);
    },

    // Insights Management
    getInsights: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Insight>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getInsights ---', { page, limit });
            await mockApiDelay();

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedInsights = mockInsights.slice(startIndex, endIndex);

            return {
                results: paginatedInsights,
                page,
                limit,
                totalPages: Math.ceil(mockInsights.length / limit),
                totalResults: mockInsights.length
            };
        }
        const response = await api.get(`/admin/insights?page=${page}&limit=${limit}`);
        return response.data;
    },

    getInsightById: async (id: string): Promise<Insight> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getInsightById ---', { id });
            await mockApiDelay();
            const insight = mockInsights.find(i => i.id === id);
            if (!insight) {
                throw new Error('Insight not found');
            }
            return insight;
        }
        const response = await api.get(`/admin/insights/${id}`);
        return response.data;
    },

    createInsight: async (insightData: CreateInsightInput): Promise<Insight> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: createInsight ---', insightData);
            await mockApiDelay();
            const newInsight: Insight = {
                id: `i_${Date.now()}`,
                ...insightData,
                publishedAt: new Date().toISOString()
            };
            return newInsight;
        }
        const response = await api.post('/admin/insights', insightData);
        return response.data;
    },

    updateInsight: async (id: string, insightData: UpdateInsightInput): Promise<Insight> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: updateInsight ---', { id, insightData });
            await mockApiDelay();
            const existingInsight = mockInsights.find(i => i.id === id);
            if (!existingInsight) {
                throw new Error('Insight not found');
            }
            const updatedInsight: Insight = {
                ...existingInsight,
                ...insightData
            };
            return updatedInsight;
        }
        const response = await api.put(`/admin/insights/${id}`, insightData);
        return response.data;
    },

    deleteInsight: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: deleteInsight ---', { id });
            await mockApiDelay();
            return;
        }
        await api.delete(`/admin/insights/${id}`);
    },

    // Caregivers Management
    getCaregivers: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Caregiver>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getCaregivers ---', { page, limit });
            await mockApiDelay();

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedCaregivers = mockCaregivers.slice(startIndex, endIndex);

            return {
                results: paginatedCaregivers,
                page,
                limit,
                totalPages: Math.ceil(mockCaregivers.length / limit),
                totalResults: mockCaregivers.length
            };
        }
        const response = await api.get(`/admin/caregivers?page=${page}&limit=${limit}`);
        return response.data;
    },

    getCaregiverById: async (id: string): Promise<Caregiver> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getCaregiverById ---', { id });
            await mockApiDelay();
            const caregiver = mockCaregivers.find(c => c.id === id);
            if (!caregiver) {
                throw new Error('Caregiver not found');
            }
            return caregiver;
        }
        const response = await api.get(`/admin/caregivers/${id}`);
        return response.data;
    },

    createCaregiver: async (caregiverData: CreateCaregiverInput): Promise<Caregiver> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: createCaregiver ---', caregiverData);
            await mockApiDelay();
            const newCaregiver: Caregiver = {
                id: `c_${Date.now()}`,
                verified: false,
                ...caregiverData
            };
            return newCaregiver;
        }
        const response = await api.post('/admin/caregivers', caregiverData);
        return response.data;
    },

    updateCaregiver: async (id: string, caregiverData: UpdateCaregiverInput): Promise<Caregiver> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: updateCaregiver ---', { id, caregiverData });
            await mockApiDelay();
            const existingCaregiver = mockCaregivers.find(c => c.id === id);
            if (!existingCaregiver) {
                throw new Error('Caregiver not found');
            }
            const updatedCaregiver: Caregiver = {
                ...existingCaregiver,
                ...caregiverData
            };
            return updatedCaregiver;
        }
        const response = await api.put(`/admin/caregivers/${id}`, caregiverData);
        return response.data;
    },

    deleteCaregiver: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: deleteCaregiver ---', { id });
            await mockApiDelay();
            return;
        }
        await api.delete(`/admin/caregivers/${id}`);
    },

    // Questions Management (Admin view)
    getAllQuestions: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Question>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getAllQuestions ---', { page, limit });
            await mockApiDelay();

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedQuestions = mockQuestions.slice(startIndex, endIndex);

            return {
                results: paginatedQuestions,
                page,
                limit,
                totalPages: Math.ceil(mockQuestions.length / limit),
                totalResults: mockQuestions.length
            };
        }
        const response = await api.get(`/admin/questions?page=${page}&limit=${limit}`);
        return response.data;
    },

    updateQuestionStatus: async (id: string, status: 'pending' | 'answered'): Promise<Question> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: updateQuestionStatus ---', { id, status });
            await mockApiDelay();
            const existingQuestion = mockQuestions.find(q => q.id === id);
            if (!existingQuestion) {
                throw new Error('Question not found');
            }
            const updatedQuestion: Question = {
                ...existingQuestion,
                status,
                updatedAt: new Date().toISOString()
            };
            return updatedQuestion;
        }
        const response = await api.put(`/admin/questions/${id}/status`, { status });
        return response.data;
    }
};
