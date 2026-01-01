import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MessageCircle, Clock, CheckCircle, User, MapPin, Users, Phone, Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { questionsService } from '@/services/questions';
import type { Question } from '@/types/geriacare';

const QuestionCard = ({ question, onViewDetails }: { question: Question; onViewDetails: (id: string) => void }) => {
    return (
        <Card className='border-2 border-border/50 hover:border-primary/30 transition-all duration-200'>
            <CardHeader className='pb-4'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='space-y-3 flex-1'>
                        <div className='flex items-center gap-3'>
                            <Badge
                                variant={question.status === 'answered' ? 'default' : 'secondary'}
                                className='px-3 py-1 text-sm font-medium'
                            >
                                {question.status === 'answered' ? (
                                    <>
                                        <CheckCircle className='h-4 w-4 mr-1' />
                                        Answered
                                    </>
                                ) : (
                                    <>
                                        <Clock className='h-4 w-4 mr-1' />
                                        Pending
                                    </>
                                )}
                            </Badge>
                            <span className='text-sm text-muted-foreground'>
                                <Calendar className='h-4 w-4 inline mr-1' />
                                {format(new Date(question.createdAt), 'MMM dd, yyyy')}
                            </span>
                        </div>

                        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                                <User className='h-4 w-4' />
                                {question.name}
                            </div>
                            <div className='flex items-center gap-1'>
                                <MapPin className='h-4 w-4' />
                                {question.city}
                            </div>
                            <div className='flex items-center gap-1'>
                                <Users className='h-4 w-4' />
                                {question.relation}
                            </div>
                            {question.phone && (
                                <div className='flex items-center gap-1'>
                                    <Phone className='h-4 w-4' />
                                    WhatsApp Available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className='space-y-4'>
                <div className='space-y-2'>
                    <p className='text-foreground line-clamp-3 leading-relaxed'>{question.content}</p>
                    {question.content.length > 150 && <p className='text-sm text-muted-foreground'>...</p>}
                </div>

                <Separator />

                <div className='flex items-center justify-between'>
                    {question.status === 'answered' ? (
                        <span className='text-sm text-green-600 dark:text-green-400 font-medium'>
                            Response available
                        </span>
                    ) : (
                        <span className='text-sm text-muted-foreground'>
                            Our care experts will respond within 24-48 hours
                        </span>
                    )}

                    <Button
                        variant={question.status === 'answered' ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => onViewDetails(question.id)}
                        className='ml-auto'
                    >
                        <MessageCircle className='h-4 w-4 mr-2' />
                        {question.status === 'answered' ? 'View Response' : 'View Details'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const QuestionsListSkeleton = () => (
    <div className='space-y-6'>
        {[...Array(3)].map((_, i) => (
            <Card
                key={i}
                className='border-2 border-border/50'
            >
                <CardHeader className='pb-4'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='space-y-3 flex-1'>
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-6 w-20' />
                                <Skeleton className='h-4 w-24' />
                            </div>
                            <div className='flex gap-4'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-4 w-28' />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-4/5' />
                        <Skeleton className='h-4 w-3/5' />
                    </div>
                    <div className='flex justify-between items-center'>
                        <Skeleton className='h-4 w-48' />
                        <Skeleton className='h-9 w-28' />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export const QuestionsList = ({ onQuestionSelect }: { onQuestionSelect: (questionId: string) => void }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;

    const {
        data: questionsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['questions', currentPage],
        queryFn: () => questionsService.getQuestions(currentPage, questionsPerPage)
    });

    if (isLoading) {
        return <QuestionsListSkeleton />;
    }

    if (error) {
        return (
            <Card className='border-2 border-destructive/20'>
                <CardContent className='p-8 text-center'>
                    <p className='text-lg text-destructive'>Failed to load questions. Please try again later.</p>
                </CardContent>
            </Card>
        );
    }

    if (!questionsData?.results.length) {
        return (
            <Card className='border-2 border-border/50'>
                <CardContent className='p-8 lg:p-12 text-center space-y-4'>
                    <MessageCircle className='h-16 w-16 mx-auto text-muted-foreground' />
                    <div className='space-y-2'>
                        <h3 className='text-xl font-semibold text-foreground'>No Questions Yet</h3>
                        <p className='text-muted-foreground'>
                            You haven't asked any questions yet. Submit your first care question to get personalized
                            guidance.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-foreground'>Your Questions</h2>
                    <p className='text-muted-foreground'>
                        {questionsData.totalResults} question{questionsData.totalResults !== 1 ? 's' : ''} submitted
                    </p>
                </div>
            </div>

            <div className='space-y-4'>
                {questionsData.results.map(question => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        onViewDetails={onQuestionSelect}
                    />
                ))}
            </div>

            {questionsData.totalPages > 1 && (
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className='text-sm text-muted-foreground px-4'>
                        Page {currentPage} of {questionsData.totalPages}
                    </span>
                    <Button
                        variant='outline'
                        onClick={() => setCurrentPage(p => Math.min(questionsData.totalPages, p + 1))}
                        disabled={currentPage === questionsData.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
