import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
    title: string;
    description: string;
    expectedFeatures?: string[];
}

export const ComingSoonPage = ({ title, description, expectedFeatures = [] }: ComingSoonPageProps) => {
    return (
        <div className='max-w-2xl mx-auto text-center space-y-8'>
            <div className='space-y-6'>
                <div className='flex items-center justify-center'>
                    <div className='flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full'>
                        <Heart className='h-8 w-8 lg:h-10 lg:w-10 text-primary' />
                    </div>
                </div>

                <h1 className='text-3xl lg:text-4xl font-bold text-foreground'>{title}</h1>

                <p className='text-lg lg:text-xl text-muted-foreground leading-relaxed'>{description}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='text-xl text-primary'>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <p className='text-base text-muted-foreground'>
                        We're working hard to bring you this feature. It will include:
                    </p>

                    {expectedFeatures.length > 0 && (
                        <ul className='space-y-2 text-left max-w-md mx-auto'>
                            {expectedFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className='flex items-start space-x-2 text-sm text-muted-foreground'
                                >
                                    <span className='text-primary font-bold'>•</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <p className='text-sm text-muted-foreground'>
                        In the meantime, explore our other features or contact us for immediate support.
                    </p>
                </CardContent>
            </Card>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link to='/'>
                    <Button
                        variant='outline'
                        className='w-full sm:w-auto'
                    >
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back to Home
                    </Button>
                </Link>
                <a
                    href='https://wa.me/+919876543210'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Button className='w-full sm:w-auto'>WhatsApp Support</Button>
                </a>
            </div>
        </div>
    );
};
