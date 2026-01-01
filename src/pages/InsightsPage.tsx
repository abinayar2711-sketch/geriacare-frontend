import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, User, BookOpen, Heart, Utensils, Droplets, Clock } from 'lucide-react';
import { insightsService } from '@/services/insights';
import type { Insight } from '@/types/geriacare';
import { INSIGHT_CATEGORIES } from '@/types/geriacare';

interface InsightCardProps {
    insight: Insight;
    onRead: (insight: Insight) => void;
}

const InsightCard = ({ insight, onRead }: InsightCardProps) => {
    const getCategoryConfig = (category: string) => {
        const configs = {
            'Food & Nutrition': {
                gradient: 'from-green-400 via-green-500 to-green-600',
                bgColor: 'bg-green-50',
                textColor: 'text-green-800',
                borderColor: 'border-green-200',
                icon: Utensils
            },
            'Bathing & Hygiene': {
                gradient: 'from-blue-400 via-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-800',
                borderColor: 'border-blue-200',
                icon: Droplets
            },
            'Daily Routine': {
                gradient: 'from-purple-400 via-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-800',
                borderColor: 'border-purple-200',
                icon: Clock
            },
            'Emotional Wellbeing': {
                gradient: 'from-pink-400 via-pink-500 to-pink-600',
                bgColor: 'bg-pink-50',
                textColor: 'text-pink-800',
                borderColor: 'border-pink-200',
                icon: Heart
            },
            'General Care': {
                gradient: 'from-gray-400 via-gray-500 to-gray-600',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-800',
                borderColor: 'border-gray-200',
                icon: BookOpen
            }
        };
        return configs[category as keyof typeof configs] || configs['General Care'];
    };

    const config = getCategoryConfig(insight.category);
    const IconComponent = config.icon;

    return (
        <div
            className={`group relative overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
        >
            {/* Gradient header */}
            <div className={`h-2 bg-gradient-to-r ${config.gradient}`}></div>

            <div className='p-6'>
                {/* Category badge */}
                <div className='flex items-center justify-between mb-4'>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.textColor} ${config.bgColor} border ${config.borderColor}`}
                    >
                        <IconComponent className='h-4 w-4' />
                        {insight.category}
                    </span>
                </div>

                {/* Title */}
                <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors'>
                    {insight.title}
                </h3>

                {/* Excerpt */}
                <p className='text-gray-600 text-base leading-relaxed mb-4 line-clamp-3'>{insight.excerpt}</p>

                {/* Author and date */}
                <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                    <div className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        <span className='font-medium'>{insight.author}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        <span>
                            {new Date(insight.publishedAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Read more button */}
                <button
                    onClick={() => onRead(insight)}
                    className={`w-full px-4 py-3 bg-gradient-to-r ${config.gradient} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg`}
                >
                    <BookOpen className='h-5 w-5' />
                    Read Article
                </button>
            </div>
        </div>
    );
};

interface InsightModalProps {
    insight: Insight | null;
    isOpen: boolean;
    onClose: () => void;
}

const InsightModal = ({ insight, isOpen, onClose }: InsightModalProps) => {
    if (!isOpen || !insight) return null;

    const getCategoryConfig = (category: string) => {
        const configs = {
            'Food & Nutrition': {
                gradient: 'from-green-400 via-green-500 to-green-600',
                bgColor: 'bg-green-50',
                textColor: 'text-green-800',
                icon: Utensils
            },
            'Bathing & Hygiene': {
                gradient: 'from-blue-400 via-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-800',
                icon: Droplets
            },
            'Daily Routine': {
                gradient: 'from-purple-400 via-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-800',
                icon: Clock
            },
            'Emotional Wellbeing': {
                gradient: 'from-pink-400 via-pink-500 to-pink-600',
                bgColor: 'bg-pink-50',
                textColor: 'text-pink-800',
                icon: Heart
            },
            'General Care': {
                gradient: 'from-gray-400 via-gray-500 to-gray-600',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-800',
                icon: BookOpen
            }
        };
        return configs[category as keyof typeof configs] || configs['General Care'];
    };

    const config = getCategoryConfig(insight.category);
    const IconComponent = config.icon;

    const formatContent = (content: string) => {
        return content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1;
                const text = paragraph.replace(/^#+\s*/, '');
                const adjustedLevel = Math.min(level + 1, 6);

                if (adjustedLevel === 2) {
                    return (
                        <h2
                            key={index}
                            className='font-bold mb-4 text-2xl text-gray-800'
                        >
                            {text}
                        </h2>
                    );
                } else if (adjustedLevel === 3) {
                    return (
                        <h3
                            key={index}
                            className='font-bold mb-4 text-xl text-gray-800'
                        >
                            {text}
                        </h3>
                    );
                } else {
                    return (
                        <h4
                            key={index}
                            className='font-bold mb-4 text-lg text-gray-800'
                        >
                            {text}
                        </h4>
                    );
                }
            }

            if (paragraph.trim().startsWith('*Disclaimer:')) {
                return (
                    <div
                        key={index}
                        className={`p-4 rounded-lg ${config.bgColor} border-l-4 bg-gradient-to-r ${config.gradient} border-l-blue-500 mb-6`}
                    >
                        <p className='text-sm text-gray-700 italic'>{paragraph.replace(/\*/g, '')}</p>
                    </div>
                );
            }

            return (
                <p
                    key={index}
                    className='mb-4 text-gray-700 leading-relaxed text-base'
                >
                    {paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .split(/(<strong>.*?<\/strong>|<em>.*?<\/em>)/)
                        .map((part, i) => {
                            if (part.startsWith('<strong>')) {
                                return <strong key={i}>{part.replace(/<\/?strong>/g, '')}</strong>;
                            } else if (part.startsWith('<em>')) {
                                return <em key={i}>{part.replace(/<\/?em>/g, '')}</em>;
                            }
                            return part;
                        })}
                </p>
            );
        });
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
                    <div className='flex items-center justify-between mb-4'>
                        <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm`}
                        >
                            <IconComponent className='h-4 w-4' />
                            {insight.category}
                        </span>
                        <button
                            onClick={onClose}
                            className='text-white hover:bg-white/20 rounded-lg p-2 transition-colors'
                        >
                            ×
                        </button>
                    </div>
                    <h2 className='text-2xl font-bold mb-2'>{insight.title}</h2>
                    <div className='flex items-center gap-4 text-white/90'>
                        <div className='flex items-center gap-2'>
                            <User className='h-4 w-4' />
                            <span>{insight.author}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            <span>
                                {new Date(insight.publishedAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='prose prose-lg max-w-none'>{formatContent(insight.content)}</div>
                </div>
            </div>
        </div>
    );
};

const InsightsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: insightsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['insights', currentPage, selectedCategory, searchQuery],
        queryFn: () =>
            insightsService.getInsights({
                page: currentPage,
                limit: 12,
                category: selectedCategory,
                search: searchQuery
            })
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleReadInsight = (insight: Insight) => {
        setSelectedInsight(insight);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInsight(null);
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
                <div className='container mx-auto px-4 py-12'>
                    <div className='flex items-center justify-center min-h-[400px]'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4'></div>
                            <p className='text-gray-600 text-lg'>Loading insights...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
                <div className='container mx-auto px-4 py-12'>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md mx-auto'>
                        <p className='text-red-600 text-lg'>Failed to load insights</p>
                        <p className='text-red-500 text-sm mt-2'>Please try again later</p>
                    </div>
                </div>
            </div>
        );
    }

    const insights = insightsData?.results || [];
    const totalPages = insightsData?.totalPages || 1;
    const totalResults = insightsData?.totalResults || 0;

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <div className='flex justify-center mb-4'>
                        <div className='bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl'>
                            <BookOpen className='h-12 w-12 text-white' />
                        </div>
                    </div>
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Care Insights & Guidance</h1>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                        Expert observations and opinions on food, hygiene, routines, and emotional wellbeing for seniors
                        70+
                    </p>
                    <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto'>
                        <p className='text-sm text-blue-800'>
                            <strong>Disclaimer:</strong> This content provides general guidance and is not medical
                            advice. Always consult healthcare professionals for specific medical concerns.
                        </p>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className='mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4'>
                    {/* Search */}
                    <div className='relative flex-1'>
                        <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search insights by title, content, or author...'
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            className='w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm'
                        />
                    </div>

                    {/* Category Filter */}
                    <div className='flex items-center gap-2 md:w-auto'>
                        <Filter className='h-5 w-5 text-gray-500' />
                        <select
                            value={selectedCategory}
                            onChange={e => handleCategoryChange(e.target.value)}
                            className='px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm min-w-[200px]'
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
                </div>

                {/* Results count */}
                {(searchQuery || selectedCategory !== 'all') && (
                    <div className='mb-6 text-center'>
                        <p className='text-gray-600 text-lg'>
                            Found <span className='font-bold text-blue-600'>{totalResults}</span> insights
                            {selectedCategory !== 'all' && (
                                <span>
                                    {' '}
                                    in <span className='font-semibold'>{selectedCategory}</span>
                                </span>
                            )}
                            {searchQuery && (
                                <span>
                                    {' '}
                                    for "<span className='font-semibold'>{searchQuery}</span>"
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {/* Insights Grid */}
                {insights.length === 0 ? (
                    <div className='text-center py-12'>
                        <BookOpen className='h-24 w-24 text-gray-300 mx-auto mb-4' />
                        <p className='text-gray-500 text-xl mb-2'>No insights found</p>
                        <p className='text-gray-400'>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12'>
                        {insights.map(insight => (
                            <InsightCard
                                key={insight.id}
                                insight={insight}
                                onRead={handleReadInsight}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex items-center justify-center gap-2 mt-12'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors'
                        >
                            Previous
                        </button>

                        <div className='flex items-center gap-1'>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors'
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Insight Modal */}
            <InsightModal
                insight={selectedInsight}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
};

export default InsightsPage;
