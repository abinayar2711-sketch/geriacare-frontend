import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Star, Mail, User, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '@/services/admin';
import type { Feedback } from '@/types/geriacare';
import { FEEDBACK_TYPES } from '@/types/geriacare';

const ITEMS_PER_PAGE = 10;

const ManageFeedbackPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('all');
    const queryClient = useQueryClient();

    const {
        data: feedbackData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['admin-feedback', currentPage],
        queryFn: () => adminService.getFeedback(currentPage, ITEMS_PER_PAGE)
    });

    const deleteFeedbackMutation = useMutation({
        mutationFn: adminService.deleteFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            deleteFeedbackMutation.mutate(id);
        }
    };

    const filteredFeedback =
        feedbackData?.results?.filter(feedback => selectedType === 'all' || feedback.feedbackType === selectedType) ||
        [];

    const renderStars = (rating?: number) => {
        if (!rating) return <span className='text-gray-400'>No rating</span>;

        return (
            <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
                <span className='ml-1 text-sm text-gray-600'>({rating}/5)</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
                <p className='text-red-600'>Failed to load feedback data</p>
            </div>
        );
    }

    const totalPages = feedbackData?.totalPages || 1;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-bold text-gray-900'>Manage Feedback</h1>

                <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4 text-gray-500' />
                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    >
                        <option value='all'>All Types</option>
                        {FEEDBACK_TYPES.map(type => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-gray-200 bg-gray-50'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    User
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Type
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Rating
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Message
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Submitted
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredFeedback.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className='px-6 py-12 text-center text-gray-500'
                                    >
                                        No feedback found
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedback.map((feedback: Feedback) => (
                                    <tr
                                        key={feedback.id}
                                        className='hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='flex-shrink-0'>
                                                    <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                                                        <User className='h-4 w-4 text-blue-600' />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='text-sm font-medium text-gray-900'>{feedback.name}</p>
                                                    {feedback.email && (
                                                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                                                            <Mail className='h-3 w-3' />
                                                            {feedback.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                {feedback.feedbackType}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>{renderStars(feedback.rating)}</td>
                                        <td className='px-6 py-4 max-w-xs'>
                                            <p className='text-sm text-gray-900 line-clamp-3'>{feedback.message}</p>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                                                <Clock className='h-3 w-3' />
                                                {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <button
                                                onClick={() => handleDelete(feedback.id)}
                                                disabled={deleteFeedbackMutation.isPending}
                                                className='text-red-600 hover:text-red-800 disabled:opacity-50 p-1 rounded-lg hover:bg-red-50 transition-colors'
                                                title='Delete feedback'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-700'>
                        Showing page {currentPage} of {totalPages}
                        {feedbackData?.totalResults && ` (${feedbackData.totalResults} total)`}
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <ChevronLeft className='h-4 w-4' />
                            Previous
                        </button>

                        <div className='flex items-center gap-1'>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Next
                            <ChevronRight className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFeedbackPage;
