import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircleQuestion, Plus, List } from 'lucide-react';

import { QuestionForm } from '@/components/questions/QuestionForm';
import { QuestionsList } from '@/components/questions/QuestionsList';
import { QuestionDetail } from '@/components/questions/QuestionDetail';

export const QuestionsPage = () => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('ask');

    const handleQuestionSelect = (questionId: string) => {
        setSelectedQuestionId(questionId);
        setActiveTab('view');
    };

    const handleBackToList = () => {
        setSelectedQuestionId(null);
        setActiveTab('my-questions');
    };

    if (selectedQuestionId) {
        return (
            <div className='container max-w-6xl mx-auto px-4 py-8 lg:py-12'>
                <QuestionDetail
                    questionId={selectedQuestionId}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className='container max-w-6xl mx-auto px-4 py-8 lg:py-12'>
            <div className='space-y-8'>
                {/* Header */}
                <div className='text-center space-y-4'>
                    <div className='flex items-center justify-center mb-6'>
                        <div className='flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full'>
                            <MessageCircleQuestion className='h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground' />
                        </div>
                    </div>
                    <h1 className='text-3xl lg:text-5xl font-bold text-foreground'>Care Questions</h1>
                    <p className='text-xl lg:text-2xl text-primary font-medium'>
                        Get personalized guidance for senior care
                    </p>
                    <p className='text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
                        Submit your care questions and get expert guidance from experienced professionals. We provide
                        practical, observation-based advice for everyday senior care challenges.
                    </p>
                </div>

                {/* Important Notice */}
                <Card className='border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800'>
                    <CardContent className='p-6'>
                        <div className='flex items-start space-x-3'>
                            <div className='flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                            <div className='space-y-1'>
                                <p className='font-semibold text-blue-900 dark:text-blue-100'>Important Disclaimer</p>
                                <p className='text-blue-800 dark:text-blue-200 leading-relaxed'>
                                    This service provides domestic care guidance only and is not a substitute for
                                    medical advice. For any medical concerns or emergencies, please consult a qualified
                                    healthcare professional immediately.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className='space-y-6'
                >
                    <div className='flex justify-center'>
                        <TabsList className='grid w-full max-w-md grid-cols-2 p-1 h-12'>
                            <TabsTrigger
                                value='ask'
                                className='text-base font-medium py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                <Plus className='h-4 w-4 mr-2' />
                                Ask Question
                            </TabsTrigger>
                            <TabsTrigger
                                value='my-questions'
                                className='text-base font-medium py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                            >
                                <List className='h-4 w-4 mr-2' />
                                My Questions
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent
                        value='ask'
                        className='mt-8'
                    >
                        <QuestionForm />
                    </TabsContent>

                    <TabsContent
                        value='my-questions'
                        className='mt-8'
                    >
                        <QuestionsList onQuestionSelect={handleQuestionSelect} />
                    </TabsContent>
                </Tabs>

                {/* Help Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-12'>
                    <Card className='border-2 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800'>
                        <CardHeader>
                            <CardTitle className='text-green-900 dark:text-green-100 flex items-center gap-2'>
                                <MessageCircleQuestion className='h-5 w-5' />
                                What types of questions can I ask?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2 text-green-800 dark:text-green-200'>
                                <li>• Daily routine and activity guidance</li>
                                <li>• Nutrition and eating habits</li>
                                <li>• Bathing and hygiene support</li>
                                <li>• Emotional wellbeing concerns</li>
                                <li>• Safety and mobility questions</li>
                                <li>• Sleep and rest patterns</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className='border-2 border-purple-200 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800'>
                        <CardHeader>
                            <CardTitle className='text-purple-900 dark:text-purple-100 flex items-center gap-2'>
                                <MessageCircleQuestion className='h-5 w-5' />
                                How does the response process work?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2 text-purple-800 dark:text-purple-200'>
                                <li>• Submit your detailed question</li>
                                <li>• Our experts review within 24-48 hours</li>
                                <li>• Receive personalized guidance</li>
                                <li>• Continue the conversation as needed</li>
                                <li>• WhatsApp support if phone provided</li>
                                <li>• All conversations remain private</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
