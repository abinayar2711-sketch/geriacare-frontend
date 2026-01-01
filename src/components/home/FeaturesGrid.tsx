import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion, BookOpen, Users, MessageCircle, ArrowRight, Heart } from 'lucide-react';

const features = [
    {
        icon: MessageCircleQuestion,
        title: 'Ask Care Questions',
        description: 'Get personalized guidance for your senior care questions from our experienced team.',
        href: '/questions',
        buttonText: 'Ask a Question'
    },
    {
        icon: BookOpen,
        title: 'Care Insights',
        description: 'Access expert observations and opinions on food, hygiene, routines, and emotional wellbeing.',
        href: '/insights',
        buttonText: 'Read Insights'
    },
    {
        icon: Users,
        title: 'Find Caregivers',
        description: 'Connect with verified and experienced caregivers (aaya) in your city.',
        href: '/caregivers',
        buttonText: 'Browse Caregivers'
    },
    {
        icon: MessageCircle,
        title: 'Share Feedback',
        description: 'Help us improve by sharing your experience and suggestions.',
        href: '/feedback',
        buttonText: 'Give Feedback'
    }
];

export const FeaturesGrid = () => {
    return (
        <section className='py-12 lg:py-16'>
            <div className='text-center mb-12'>
                <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>How We Support You</h2>
                <p className='text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto'>
                    Comprehensive care support designed specifically for families with seniors aged 70+
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
                {features.map(feature => {
                    const IconComponent = feature.icon;

                    return (
                        <Card
                            key={feature.title}
                            className='group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20'
                        >
                            <CardHeader className='space-y-4'>
                                <div className='flex items-center space-x-4'>
                                    <div className='flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors'>
                                        <IconComponent className='h-6 w-6 lg:h-7 lg:w-7 text-primary' />
                                    </div>
                                    <CardTitle className='text-xl lg:text-2xl text-foreground'>
                                        {feature.title}
                                    </CardTitle>
                                </div>
                                <CardDescription className='text-base lg:text-lg text-muted-foreground leading-relaxed'>
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='pt-0'>
                                <Link to={feature.href}>
                                    <Button
                                        variant='outline'
                                        className='w-full text-base lg:text-lg py-3 h-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
                                    >
                                        {feature.buttonText}
                                        <ArrowRight className='ml-2 h-4 w-4' />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Additional Support Section */}
            <div className='mt-12 lg:mt-16 p-6 lg:p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20'>
                <div className='text-center space-y-4'>
                    <div className='flex items-center justify-center'>
                        <Heart className='h-8 w-8 lg:h-10 lg:w-10 text-primary' />
                    </div>
                    <h3 className='text-2xl lg:text-3xl font-bold text-foreground'>Need Immediate Support?</h3>
                    <p className='text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto'>
                        Our WhatsApp support is available to help you with urgent care questions. Get quick responses
                        from our experienced team.
                    </p>
                    <div className='pt-4'>
                        <a
                            href='https://wa.me/+919876543210'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Button
                                size='lg'
                                className='text-lg px-8 py-6 h-auto'
                            >
                                <MessageCircle className='mr-2 h-5 w-5' />
                                WhatsApp Support
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
