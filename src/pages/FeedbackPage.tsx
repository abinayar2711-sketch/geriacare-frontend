import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Star, Send, CheckCircle, User, Mail, MessageSquare, Tag } from 'lucide-react';
import { feedbackService } from '@/services/feedback';
import { FEEDBACK_TYPES } from '@/types/geriacare';
import type { CreateFeedbackInput } from '@/types/geriacare';

const FeedbackPage = () => {
    const [formData, setFormData] = useState<CreateFeedbackInput>({
        name: '',
        email: '',
        feedbackType: 'General Feedback',
        message: '',
        rating: 0
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const submitFeedbackMutation = useMutation({
        mutationFn: feedbackService.submitFeedback,
        onSuccess: () => {
            setShowSuccess(true);
            setFormData({
                name: '',
                email: '',
                feedbackType: 'General Feedback',
                message: '',
                rating: 0
            });
            // Auto hide success message after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000);
        }
    });

    const handleStarClick = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleInputChange = (field: keyof CreateFeedbackInput, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.message) {
            submitFeedbackMutation.mutate(formData);
        }
    };

    const renderStars = () => {
        return (
            <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }, (_, i) => (
                    <button
                        key={i}
                        type='button'
                        onClick={() => handleStarClick(i + 1)}
                        className='transition-colors hover:scale-110 transform'
                    >
                        <Star
                            className={`h-8 w-8 ${
                                i < (formData.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-200'
                            }`}
                        />
                    </button>
                ))}
                {(formData.rating || 0) > 0 && (
                    <span className='ml-2 text-sm text-gray-600'>({formData.rating}/5)</span>
                )}
            </div>
        );
    };

    if (showSuccess) {
        return (
            <div className='max-w-2xl mx-auto px-4 py-8'>
                <div className='bg-green-50 border border-green-200 rounded-lg p-8 text-center'>
                    <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
                    <h2 className='text-2xl font-bold text-green-900 mb-2'>Thank You!</h2>
                    <p className='text-green-700 mb-4'>
                        Your feedback has been successfully submitted. We appreciate you taking the time to help us
                        improve our services.
                    </p>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'
                    >
                        Submit Another Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-2xl mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>Share Your Feedback</h1>
                    <p className='text-gray-600'>
                        We value your opinion and want to hear about your experience with Geriacare. Your feedback helps
                        us improve our services for the senior care community.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                >
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor='name'
                            className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'
                        >
                            <User className='h-4 w-4' />
                            Your Name *
                        </label>
                        <input
                            type='text'
                            id='name'
                            required
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
                            placeholder='Enter your full name'
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor='email'
                            className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'
                        >
                            <Mail className='h-4 w-4' />
                            Email (Optional)
                        </label>
                        <input
                            type='email'
                            id='email'
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
                            placeholder='Enter your email address'
                        />
                    </div>

                    {/* Feedback Type */}
                    <div>
                        <label
                            htmlFor='feedbackType'
                            className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'
                        >
                            <Tag className='h-4 w-4' />
                            Feedback Type
                        </label>
                        <select
                            id='feedbackType'
                            value={formData.feedbackType}
                            onChange={e => handleInputChange('feedbackType', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
                        >
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

                    {/* Rating */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-3'>
                            <Star className='h-4 w-4' />
                            Rate Your Experience (Optional)
                        </label>
                        <div className='flex flex-col gap-2'>
                            {renderStars()}
                            <p className='text-xs text-gray-500'>Click on stars to rate your experience</p>
                        </div>
                    </div>

                    {/* Message Field */}
                    <div>
                        <label
                            htmlFor='message'
                            className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'
                        >
                            <MessageSquare className='h-4 w-4' />
                            Your Feedback *
                        </label>
                        <textarea
                            id='message'
                            required
                            rows={6}
                            value={formData.message}
                            onChange={e => handleInputChange('message', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-vertical'
                            placeholder='Share your thoughts, suggestions, or experiences with our service...'
                        />
                    </div>

                    {/* Submit Button */}
                    <div className='flex flex-col gap-4'>
                        <button
                            type='submit'
                            disabled={submitFeedbackMutation.isPending || !formData.name || !formData.message}
                            className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2'
                        >
                            {submitFeedbackMutation.isPending ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className='h-4 w-4' />
                                    Submit Feedback
                                </>
                            )}
                        </button>

                        {submitFeedbackMutation.error && (
                            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                <p className='text-red-600 text-sm'>
                                    Failed to submit feedback. Please try again or contact us directly.
                                </p>
                            </div>
                        )}

                        <p className='text-xs text-gray-500 text-center'>
                            * Required fields. Your feedback is confidential and will be used to improve our services.
                        </p>
                    </div>
                </form>
            </div>

            {/* Additional Information */}
            <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-blue-900 mb-3'>Other Ways to Reach Us</h3>
                <div className='space-y-2 text-blue-700'>
                    <p>📱 WhatsApp: Contact us directly for immediate assistance</p>
                    <p>📧 Email: Send detailed feedback and suggestions</p>
                    <p className='text-sm text-blue-600 mt-3'>
                        We typically respond to feedback within 24-48 hours during business days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
