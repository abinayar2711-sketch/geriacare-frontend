import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Send, User, MapPin, Users, Phone, Calendar, MessageCircle, CheckCircle, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { questionsService } from '@/services/questions';
import type { Message } from '@/types/geriacare';
import { toast } from 'sonner';

const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
                <div
                    className={`rounded-lg p-4 ${
                        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'
                    }`}
                >
                    <p className='whitespace-pre-wrap leading-relaxed'>{message.content}</p>
                </div>
                <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {format(new Date(message.createdAt), 'MMM dd, yyyy at h:mm a')}
                    {isUser ? ' • You' : ' • Care Expert'}
                </div>
            </div>
        </div>
    );
};

const QuestionDetailSkeleton = () => (
    <div className='space-y-6'>
        <div className='flex items-center gap-4'>
            <Skeleton className='h-10 w-20' />
            <Skeleton className='h-8 w-48' />
        </div>

        <Card className='border-2'>
            <CardHeader>
                <div className='space-y-3'>
                    <div className='flex gap-3'>
                        <Skeleton className='h-6 w-20' />
                        <Skeleton className='h-4 w-24' />
                    </div>
                    <div className='flex gap-4'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-28' />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-4/5' />
                    <Skeleton className='h-4 w-3/5' />
                </div>
            </CardContent>
        </Card>

        <Card className='border-2'>
            <CardHeader>
                <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <Skeleton className='h-20 w-3/4' />
                    <Skeleton className='h-16 w-4/5' />
                </div>
            </CardContent>
        </Card>
    </div>
);

export const QuestionDetail = ({ questionId, onBack }: { questionId: string; onBack: () => void }) => {
    const [newMessage, setNewMessage] = useState('');
    const queryClient = useQueryClient();

    const {
        data: question,
        isLoading: isLoadingQuestion,
        error: questionError
    } = useQuery({
        queryKey: ['question', questionId],
        queryFn: () => questionsService.getQuestionById(questionId)
    });

    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ['question-messages', questionId],
        queryFn: () => questionsService.getQuestionMessages(questionId),
        enabled: !!question
    });

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => questionsService.sendMessage(questionId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['question-messages', questionId] });
            setNewMessage('');
            toast.success('Message sent successfully!');
        },
        onError: (error: Error) => {
            toast.error('Failed to send message: ' + error.message);
        }
    });

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        sendMessageMutation.mutate(newMessage.trim());
    };

    const isLoading = isLoadingQuestion || isLoadingMessages;

    if (isLoading) {
        return <QuestionDetailSkeleton />;
    }

    if (questionError || !question) {
        return (
            <div className='space-y-6'>
                <Button
                    variant='ghost'
                    onClick={onBack}
                    className='text-base font-medium'
                >
                    <ArrowLeft className='h-5 w-5 mr-2' />
                    Back to Questions
                </Button>
                <Card className='border-2 border-destructive/20'>
                    <CardContent className='p-8 text-center'>
                        <p className='text-lg text-destructive'>
                            Failed to load question details. Please try again later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <Button
                variant='ghost'
                onClick={onBack}
                className='text-base font-medium'
            >
                <ArrowLeft className='h-5 w-5 mr-2' />
                Back to Questions
            </Button>

            {/* Question Details */}
            <Card className='border-2 border-primary/10'>
                <CardHeader className='pb-4'>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-3 flex-wrap'>
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
                                        Pending Response
                                    </>
                                )}
                            </Badge>
                            <span className='text-sm text-muted-foreground'>
                                <Calendar className='h-4 w-4 inline mr-1' />
                                Submitted on {format(new Date(question.createdAt), 'MMMM dd, yyyy')}
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
                </CardHeader>

                <CardContent className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-foreground mb-2'>Original Question</h3>
                        <p className='text-foreground leading-relaxed whitespace-pre-wrap'>{question.content}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Chat/Messages Section */}
            <Card className='border-2 border-border/50'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <MessageCircle className='h-5 w-5' />
                        Conversation
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {messages.length === 0 ? (
                        <div className='text-center py-8'>
                            <MessageCircle className='h-12 w-12 mx-auto text-muted-foreground mb-3' />
                            <p className='text-muted-foreground'>
                                {question.status === 'pending'
                                    ? 'Our care experts will respond to your question within 24-48 hours.'
                                    : 'No messages yet.'}
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className='h-96 pr-4'>
                            <div className='space-y-1'>
                                {messages.map(message => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    )}

                    <Separator />

                    {/* Message Input */}
                    <div className='space-y-3'>
                        <div className='space-y-2'>
                            <Textarea
                                placeholder='Type your follow-up question or message here...'
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                className='min-h-20 resize-none'
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <p className='text-xs text-muted-foreground'>
                                Press Enter to send, Shift + Enter for a new line
                            </p>
                        </div>

                        <div className='flex justify-end'>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                                className='px-6'
                            >
                                {sendMessageMutation.isPending ? (
                                    <>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className='h-4 w-4 mr-2' />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
