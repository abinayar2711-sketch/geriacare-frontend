import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Stethoscope, Phone } from 'lucide-react';

export const Disclaimer = () => {
    return (
        <section className='space-y-6'>
            {/* Main Disclaimer */}
            <Alert className='border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20'>
                <AlertTriangle className='h-5 w-5 text-amber-600' />
                <AlertDescription className='text-base lg:text-lg leading-relaxed'>
                    <strong className='text-amber-800 dark:text-amber-200'>Important Disclaimer:</strong>
                    <br className='mb-2' />
                    Geriacare provides general domestic care guidance and observations based on experience.
                    <strong> We do not provide medical advice, diagnosis, or treatment.</strong> Always consult
                    qualified healthcare professionals for medical concerns, health conditions, or medical decisions.
                </AlertDescription>
            </Alert>

            {/* Medical Emergency Notice */}
            <Alert className='border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'>
                <Stethoscope className='h-5 w-5 text-red-600' />
                <AlertDescription className='text-base lg:text-lg leading-relaxed'>
                    <strong className='text-red-800 dark:text-red-200'>Medical Emergencies:</strong>
                    <br className='mb-2' />
                    For medical emergencies, immediately call:
                    <ul className='mt-2 space-y-1 ml-4'>
                        <li>
                            • <strong>102</strong> - Ambulance Services
                        </li>
                        <li>
                            • <strong>108</strong> - Emergency Medical Services
                        </li>
                        <li>• Your doctor or nearest hospital</li>
                    </ul>
                </AlertDescription>
            </Alert>

            {/* Scope of Services */}
            <div className='bg-muted/30 rounded-lg p-6 lg:p-8 space-y-6'>
                <h3 className='text-xl lg:text-2xl font-semibold text-foreground'>What We Cover vs. What We Don't</h3>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* What We Do */}
                    <div className='space-y-4'>
                        <h4 className='text-lg font-semibold text-green-700 dark:text-green-400'>✓ What We Provide</h4>
                        <ul className='space-y-2 text-sm lg:text-base text-muted-foreground'>
                            <li>• Daily care routines and tips</li>
                            <li>• Hygiene and bathing guidance</li>
                            <li>• Nutritional suggestions for seniors</li>
                            <li>• Emotional support strategies</li>
                            <li>• Caregiver recommendations</li>
                            <li>• Family education resources</li>
                            <li>• Practical home care advice</li>
                        </ul>
                    </div>

                    {/* What We Don't Do */}
                    <div className='space-y-4'>
                        <h4 className='text-lg font-semibold text-red-700 dark:text-red-400'>
                            ✗ What We Don't Provide
                        </h4>
                        <ul className='space-y-2 text-sm lg:text-base text-muted-foreground'>
                            <li>• Medical diagnosis or treatment</li>
                            <li>• Prescription medication advice</li>
                            <li>• Emergency medical care</li>
                            <li>• Mental health therapy</li>
                            <li>• Legal or financial advice</li>
                            <li>• Insurance claims guidance</li>
                            <li>• Direct medical services</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contact for Questions */}
            <div className='text-center p-6 bg-primary/5 rounded-lg border border-primary/20'>
                <h4 className='text-lg font-semibold text-foreground mb-3'>Questions About Our Services?</h4>
                <p className='text-base text-muted-foreground mb-4'>
                    If you're unsure whether your question is within our scope, feel free to ask. We'll guide you to the
                    right resources.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <a
                        href='https://wa.me/+919876543210'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium'
                    >
                        <Phone className='h-5 w-5' />
                        <span>WhatsApp: +91 98765 43210</span>
                    </a>
                    <span className='text-muted-foreground hidden sm:block'>•</span>
                    <a
                        href='mailto:support@geriacare.in'
                        className='text-primary hover:text-primary/80 font-medium'
                    >
                        support@geriacare.in
                    </a>
                </div>
            </div>
        </section>
    );
};
