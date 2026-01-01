import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Shield, Users, Clock } from 'lucide-react';

export const Hero = () => {
    return (
        <section className='relative py-12 lg:py-20'>
            <div className='text-center space-y-8'>
                {/* Main Heading */}
                <div className='space-y-6'>
                    <div className='flex items-center justify-center space-x-3 mb-4'>
                        <div className='flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full'>
                            <Heart className='h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground fill-current' />
                        </div>
                        <div className='text-left'>
                            <h1 className='text-2xl lg:text-4xl font-bold text-primary'>Geriacare</h1>
                            
                        </div>
                    </div>

                    <h2 className='text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto'>
                        <span className='text-primary'>Observation and Opinions</span>
                        <br />
                        
                    </h2>

                    <p className='text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
                        Get reliable, non-clinical guidance for everyday care needs. Connect with experienced caregivers
                        and access trusted insights for your loved ones' wellbeing.
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className='flex flex-wrap justify-center gap-6 lg:gap-8 py-6'>
                    <div className='flex items-center space-x-2 text-primary'>
                        <Shield className='h-6 w-6' />
                        <span className='text-sm lg:text-base font-medium'>Trusted Guidance</span>
                    </div>
                    <div className='flex items-center space-x-2 text-primary'>
                        <Users className='h-6 w-6' />
                        <span className='text-sm lg:text-base font-medium'>Expert Caregivers</span>
                    </div>
                    <div className='flex items-center space-x-2 text-primary'>
                        <Clock className='h-6 w-6' />
                        <span className='text-sm lg:text-base font-medium'>24/7 Support</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
                    <Link to='/questions'>
                        <Button
                            size='lg'
                            className='w-full sm:w-auto text-lg px-8 py-6 h-auto'
                        >
                            Ask a Question
                            <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                    </Link>
                    <Link to='/caregivers'>
                        <Button
                            variant='outline'
                            size='lg'
                            className='w-full sm:w-auto text-lg px-8 py-6 h-auto'
                        >
                            Find Caregivers
                        </Button>
                    </Link>
                </div>

                {/* Emergency Notice */}
                <div className='mt-8 p-4 lg:p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg max-w-2xl mx-auto'>
                    <p className='text-red-800 dark:text-red-200 font-medium text-sm lg:text-base'>
                        <strong>Emergency:</strong> For medical emergencies, call 102 (Ambulance) or your local
                        emergency services immediately. This website provides general guidance only.
                    </p>
                </div>
            </div>
        </section>
    );
};
