import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import type { CreateFeedbackInput } from '@/types/geriacare';

export const feedbackService = {
    submitFeedback: async (feedback: CreateFeedbackInput): Promise<{ success: boolean; message: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: submitFeedback ---', feedback);
            await mockApiDelay();
            return {
                success: true,
                message: 'Thank you for your feedback! Your response has been recorded.'
            };
        }

        const response = await api.post('/feedback', feedback);
        return response.data;
    }
};
