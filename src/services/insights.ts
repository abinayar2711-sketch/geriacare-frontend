import { api } from '@/lib/api';
import { buildQueryParams, mockApiDelay } from '@/lib/utils';
import { mockInsights } from '@/data/mockData';
import type { Insight } from '@/types/geriacare';
import type { PaginatedResponse } from '@/types/api';

export interface GetInsightsParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
}

export const insightsService = {
    getInsights: async (params: GetInsightsParams = {}): Promise<PaginatedResponse<Insight>> => {
        const { page = 1, limit = 12, category, search } = params;

        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getInsights ---', { page, limit, category, search });
            await mockApiDelay();

            let filteredInsights = [...mockInsights];

            // Apply category filter
            if (category && category !== 'all') {
                filteredInsights = filteredInsights.filter(insight => insight.category === category);
            }

            // Apply search filter
            if (search && search.trim()) {
                const searchLower = search.trim().toLowerCase();
                filteredInsights = filteredInsights.filter(
                    insight =>
                        insight.title.toLowerCase().includes(searchLower) ||
                        insight.excerpt.toLowerCase().includes(searchLower) ||
                        insight.content.toLowerCase().includes(searchLower) ||
                        insight.author.toLowerCase().includes(searchLower)
                );
            }

            // Sort by publication date (newest first)
            filteredInsights.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedInsights = filteredInsights.slice(startIndex, endIndex);

            return {
                results: paginatedInsights,
                page,
                limit,
                totalPages: Math.ceil(filteredInsights.length / limit),
                totalResults: filteredInsights.length
            };
        }

        const queryParams = buildQueryParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(category && category !== 'all' && { category }),
            ...(search && search.trim() && { search: search.trim() })
        });

        const response = await api.get(`/insights${queryParams ? `?${queryParams}` : ''}`);
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
        const response = await api.get(`/insights/${id}`);
        return response.data;
    },

    getInsightCategories: async (): Promise<string[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getInsightCategories ---');
            await mockApiDelay();
            const categories = [...new Set(mockInsights.map(insight => insight.category))];
            return categories.sort();
        }
        const response = await api.get('/insights/categories');
        return response.data;
    }
};
