import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Calendar, User, Tag, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { adminService } from '@/services/admin';
import type { Insight, CreateInsightInput, UpdateInsightInput } from '@/types/geriacare';
import { INSIGHT_CATEGORIES } from '@/types/geriacare';

const ITEMS_PER_PAGE = 10;

interface InsightModalProps {
    insight?: Insight;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateInsightInput | UpdateInsightInput) => void;
}

const InsightModal = ({ insight, isOpen, onClose, onSave }: InsightModalProps) => {
    const [formData, setFormData] = useState<CreateInsightInput>({
        title: insight?.title || '',
        content: insight?.content || '',
        category: insight?.category || '',
        excerpt: insight?.excerpt || '',
        author: insight?.author || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold'>{insight ? 'Edit Insight' : 'Create New Insight'}</h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4'
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Title *</label>
                            <input
                                type='text'
                                required
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Enter insight title'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>Select Category</option>
                                {INSIGHT_CATEGORIES.map(category => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Author *</label>
                        <input
                            type='text'
                            required
                            value={formData.author}
                            onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Enter author name'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Excerpt *</label>
                        <textarea
                            required
                            value={formData.excerpt}
                            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Brief description or excerpt'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Content *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            rows={15}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm'
                            placeholder='Content in Markdown format. Include disclaimer: *Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific medical concerns.*'
                        />
                    </div>

                    <div className='text-sm text-gray-600 bg-blue-50 p-4 rounded-lg'>
                        <h4 className='font-medium mb-2'>Markdown Tips:</h4>
                        <ul className='space-y-1'>
                            <li>• Use # for headings (# Title, ## Subtitle)</li>
                            <li>• Use **bold** or *italic* for emphasis</li>
                            <li>• Use 1. or - for lists</li>
                            <li>• Always include medical disclaimer at the beginning</li>
                        </ul>
                    </div>

                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                            {insight ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageInsightsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingInsight, setEditingInsight] = useState<Insight | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const queryClient = useQueryClient();

    const {
        data: insightsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['admin-insights', currentPage],
        queryFn: () => adminService.getInsights(currentPage, ITEMS_PER_PAGE)
    });

    const createInsightMutation = useMutation({
        mutationFn: adminService.createInsight,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-insights'] });
        }
    });

    const updateInsightMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateInsightInput }) => adminService.updateInsight(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-insights'] });
        }
    });

    const deleteInsightMutation = useMutation({
        mutationFn: adminService.deleteInsight,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-insights'] });
        }
    });

    const handleSave = (data: CreateInsightInput | UpdateInsightInput) => {
        if (editingInsight) {
            updateInsightMutation.mutate({
                id: editingInsight.id,
                data: data as UpdateInsightInput
            });
        } else {
            createInsightMutation.mutate(data as CreateInsightInput);
        }
    };

    const handleEdit = (insight: Insight) => {
        setEditingInsight(insight);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this insight?')) {
            deleteInsightMutation.mutate(id);
        }
    };

    const handleAddNew = () => {
        setEditingInsight(undefined);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingInsight(undefined);
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'Food & Nutrition': 'bg-green-100 text-green-800',
            'Bathing & Hygiene': 'bg-blue-100 text-blue-800',
            'Daily Routine': 'bg-purple-100 text-purple-800',
            'Emotional Wellbeing': 'bg-pink-100 text-pink-800',
            'General Care': 'bg-gray-100 text-gray-800'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                <p className='text-red-600'>Failed to load insights data</p>
            </div>
        );
    }

    const insights = insightsData?.results || [];
    const filteredInsights = insights.filter(
        insight => selectedCategory === 'all' || insight.category === selectedCategory
    );
    const totalPages = insightsData?.totalPages || 1;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-bold text-gray-900'>Manage Insights</h1>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                        <Filter className='h-4 w-4 text-gray-500' />
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        >
                            <option value='all'>All Categories</option>
                            {INSIGHT_CATEGORIES.map(category => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddNew}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        <Plus className='h-4 w-4' />
                        New Insight
                    </button>
                </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-gray-200 bg-gray-50'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Title
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Category
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Author
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Published
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredInsights.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className='px-6 py-12 text-center text-gray-500'
                                    >
                                        No insights found
                                    </td>
                                </tr>
                            ) : (
                                filteredInsights.map((insight: Insight) => (
                                    <tr
                                        key={insight.id}
                                        className='hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='max-w-md'>
                                                <h3 className='text-sm font-medium text-gray-900 line-clamp-1'>
                                                    {insight.title}
                                                </h3>
                                                <p className='text-sm text-gray-600 line-clamp-2 mt-1'>
                                                    {insight.excerpt}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(insight.category)}`}
                                            >
                                                <Tag className='h-3 w-3' />
                                                {insight.category}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2 text-sm text-gray-900'>
                                                <User className='h-4 w-4 text-gray-400' />
                                                {insight.author}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                                                <Calendar className='h-4 w-4' />
                                                {new Date(insight.publishedAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => handleEdit(insight)}
                                                    className='text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors'
                                                    title='Edit insight'
                                                >
                                                    <Edit className='h-4 w-4' />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(insight.id)}
                                                    disabled={deleteInsightMutation.isPending}
                                                    className='text-red-600 hover:text-red-800 disabled:opacity-50 p-1 rounded-lg hover:bg-red-50 transition-colors'
                                                    title='Delete insight'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </button>
                                            </div>
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
                        {insightsData?.totalResults && ` (${insightsData.totalResults} total)`}
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

            <InsightModal
                insight={editingInsight}
                isOpen={modalOpen}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default ManageInsightsPage;
