import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const mockApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const buildQueryParams = (params: Record<string, string>): string => {
    const filtered = Object.entries(params).filter(([_, value]) => value && value.trim() !== '');
    if (filtered.length === 0) return '';
    return new URLSearchParams(filtered).toString();
};
