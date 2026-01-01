import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Send, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { questionsService } from '@/services/questions';
import { RELATION_OPTIONS } from '@/types/geriacare';
import type { CreateQuestionInput } from '@/types/geriacare';

const questionFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    relation: z.string().min(1, 'Please select your relation to the senior'),
    phone: z.string().optional(),
    content: z.string().min(10, 'Please provide more details about your question (at least 10 characters)'),
    phoneConsent: z.boolean().optional()
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

export const QuestionForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            name: '',
            city: '',
            relation: '',
            phone: '',
            content: '',
            phoneConsent: false
        }
    });

    const createQuestionMutation = useMutation({
        mutationFn: (data: CreateQuestionInput) => questionsService.createQuestion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            setIsSubmitted(true);
            toast.success('Question submitted successfully!');
        },
        onError: (error: Error) => {
            toast.error('Failed to submit question: ' + error.message);
        }
    });

    const onSubmit = (data: QuestionFormData) => {
        const { phoneConsent, ...questionData } = data;
        if (!data.phone) {
            delete (questionData as any).phone;
        }

        createQuestionMutation.mutate({
            ...questionData,
            phoneConsent: phoneConsent || false
        });
    };

    if (isSubmitted) {
        return (
            <Card className='max-w-2xl mx-auto border-2 border-primary/20'>
                <CardContent className='p-8 lg:p-12 text-center space-y-6'>
                    <div className='flex items-center justify-center'>
                        <div className='flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-green-100 rounded-full'>
                            <CheckCircle className='h-8 w-8 lg:h-10 lg:w-10 text-green-600' />
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <h3 className='text-2xl lg:text-3xl font-bold text-foreground'>
                            Question Submitted Successfully!
                        </h3>
                        <p className='text-lg text-muted-foreground'>
                            Thank you for reaching out to us. Your question has been submitted and is currently being
                            reviewed by our care experts.
                        </p>
                        <p className='text-base text-muted-foreground'>
                            You can check the status of your question and any responses in your questions list. We
                            typically respond within 24-48 hours.
                        </p>
                    </div>
                    <Button
                        size='lg'
                        onClick={() => {
                            setIsSubmitted(false);
                            form.reset();
                        }}
                        className='text-lg px-8 py-6'
                    >
                        Ask Another Question
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='max-w-4xl mx-auto border-2 border-primary/10'>
            <CardHeader className='pb-6'>
                <CardTitle className='text-2xl lg:text-3xl font-bold text-center text-foreground'>
                    Ask a Care Question
                </CardTitle>
                <CardDescription className='text-lg text-center text-muted-foreground'>
                    Get personalized guidance for caring for your senior loved one. All questions are answered by
                    experienced care professionals.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                    <p className='text-sm text-blue-800 dark:text-blue-200'>
                        <strong>Important:</strong> This service provides domestic care guidance only. For medical
                        concerns, please consult a healthcare professional immediately.
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base font-medium'>Your Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter your full name'
                                                className='text-base h-12'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base font-medium'>City *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter your city'
                                                className='text-base h-12'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='relation'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base font-medium'>Your Relation to Senior *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='text-base h-12'>
                                                <SelectValue placeholder='Select your relationship to the senior' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {RELATION_OPTIONS.map(relation => (
                                                <SelectItem
                                                    key={relation}
                                                    value={relation}
                                                    className='text-base'
                                                >
                                                    {relation}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base font-medium'>Phone Number (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='+91-9876543210'
                                            className='text-base h-12'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Providing your phone number allows our team to contact you via WhatsApp for
                                        faster support.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch('phone') && (
                            <FormField
                                control={form.control}
                                name='phoneConsent'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className='space-y-1 leading-none'>
                                            <FormLabel className='text-base font-medium'>
                                                WhatsApp Communication Consent
                                            </FormLabel>
                                            <FormDescription>
                                                I consent to receive care guidance and updates via WhatsApp on the
                                                provided phone number.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base font-medium'>Your Question *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please describe your care question or concern in detail. Include relevant information about the senior's age, current situation, and specific challenges you're facing."
                                            className='min-h-32 text-base resize-none'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The more details you provide, the better we can help you. Include age, specific
                                        situations, and any relevant background.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='pt-4'>
                            <Button
                                type='submit'
                                size='lg'
                                className='w-full text-lg py-6'
                                disabled={createQuestionMutation.isPending}
                            >
                                {createQuestionMutation.isPending ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3' />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className='mr-3 h-5 w-5' />
                                        Submit Question
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
