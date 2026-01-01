import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockQuestions, mockMessages } from '@/data/mockData';
import type { Question, CreateQuestionInput, Message } from '@/types/geriacare';
import type { PaginatedResponse } from '@/types/api';

export const questionsService = {
    createQuestion: async (questionData: CreateQuestionInput): Promise<Question> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: createQuestion ---', questionData);
            await mockApiDelay();
            const newQuestion: Question = {
                id: `q_${Date.now()}`,
                ...questionData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            return newQuestion;
        }
        const response = await api.post('/questions', questionData);
        return response.data;
    },

    getQuestions: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Question>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getQuestions ---', { page, limit });
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
        const response = await api.get(`/questions?page=${page}&limit=${limit}`);
        return response.data;
    },

    getQuestionById: async (id: string): Promise<Question> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getQuestionById ---', { id });
            await mockApiDelay();
            const question = mockQuestions.find(q => q.id === id);
            if (!question) {
                throw new Error('Question not found');
            }
            return question;
        }
        const response = await api.get(`/questions/${id}`);
        return response.data;
    },

    getQuestionMessages: async (questionId: string): Promise<Message[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getQuestionMessages ---', { questionId });
            await mockApiDelay();
            return mockMessages.filter(message => message.questionId === questionId);
        }
        const response = await api.get(`/questions/${questionId}/messages`);
        return response.data;
    },

    sendMessage: async (questionId: string, content: string): Promise<Message> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: sendMessage ---', { questionId, content });
            await mockApiDelay();
            const newMessage: Message = {
                id: `m_${Date.now()}`,
                questionId,
                content,
                sender: 'user',
                createdAt: new Date().toISOString()
            };
            return newMessage;
        }
        const response = await api.post(`/questions/${questionId}/messages`, { content });
        return response.data;
    }
};
