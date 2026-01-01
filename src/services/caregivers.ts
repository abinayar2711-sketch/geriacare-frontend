import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockCaregivers } from '@/data/mockData';
import type { Caregiver } from '@/types/geriacare';
import type { PaginatedResponse } from '@/types/api';

export const caregiversService = {
    // Get all caregivers for public view (only available/verified)
    getAllCaregivers: async (
        page: number = 1,
        limit: number = 12,
        city?: string,
        minExperience?: number
    ): Promise<PaginatedResponse<Caregiver>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getAllCaregivers ---', { page, limit, city, minExperience });
            await mockApiDelay();

            // Filter caregivers (only show available/verified for public view)
            let filteredCaregivers = mockCaregivers.filter(
                caregiver => caregiver.availability === 'available' && caregiver.verified
            );

            // Apply additional filters
            if (city) {
                filteredCaregivers = filteredCaregivers.filter(caregiver =>
                    caregiver.city.toLowerCase().includes(city.toLowerCase())
                );
            }

            if (minExperience) {
                filteredCaregivers = filteredCaregivers.filter(caregiver => caregiver.experience >= minExperience);
            }

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedCaregivers = filteredCaregivers.slice(startIndex, endIndex);

            return {
                results: paginatedCaregivers,
                page,
                limit,
                totalPages: Math.ceil(filteredCaregivers.length / limit),
                totalResults: filteredCaregivers.length
            };
        }

        // Build query params
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (city) queryParams.append('city', city);
        if (minExperience) queryParams.append('minExperience', minExperience.toString());

        const response = await api.get(`/caregivers?${queryParams.toString()}`);
        return response.data;
    },

    // Get caregiver by ID
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
        const response = await api.get(`/caregivers/${id}`);
        return response.data;
    },

    // Get unique cities from caregivers
    getCaregiverCities: async (): Promise<string[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getCaregiverCities ---');
            await mockApiDelay();
            const cities = [...new Set(mockCaregivers.map(c => c.city))].sort();
            return cities;
        }
        const response = await api.get('/caregivers/cities');
        return response.data;
    }
};
