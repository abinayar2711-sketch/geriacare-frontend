import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className='bg-muted/50 border-t mt-auto'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {/* Brand & Mission */}
                    <div className='space-y-4'>
                        <Link
                            to='/'
                            className='flex items-center space-x-2'
                        >
                            <div className='flex items-center justify-center w-10 h-10 bg-primary rounded-full'>
                                <Heart className='h-5 w-5 text-primary-foreground fill-current' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-lg font-bold text-primary'>Geriacare</span>
                                
                            </div>
                        </Link>
                        <p className='text-sm lg:text-base text-muted-foreground leading-relaxed'>
                            <strong>Observation & Opinions</strong> – Trusted domestic care guidance for seniors 70+.
                            Non-clinical support for everyday care needs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-foreground text-lg'>Quick Links</h3>
                        <nav className='flex flex-col space-y-3'>
                            <Link
                                to='/about'
                                className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                            >
                                About Us
                            </Link>
                            <Link
                                to='/questions'
                                className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                            >
                                Ask a Question
                            </Link>
                            <Link
                                to='/insights'
                                className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                            >
                                Care Insights
                            </Link>
                            <Link
                                to='/caregivers'
                                className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                            >
                                Find Caregivers
                            </Link>
                            <Link
                                to='/feedback'
                                className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                            >
                                Share Feedback
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-foreground text-lg'>Contact Us</h3>
                        <div className='space-y-3'>
                            <div className='flex items-center space-x-3'>
                                <MapPin className='h-5 w-5 text-primary flex-shrink-0' />
                                <span className='text-sm lg:text-base text-muted-foreground'>
                                    Bengaluru, India
                                </span>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Phone className='h-5 w-5 text-primary flex-shrink-0' />
                                <a
                                    href='tel:+917994470688'
                                    className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                                >
                                    +91 79944 70688
                                </a>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Mail className='h-5 w-5 text-primary flex-shrink-0' />
                                <a
                                    href='mailto:support@geriacare.in'
                                    className='text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors'
                                >
                                    support@geriacare.in
                                </a>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <MessageCircle className='h-5 w-5 text-green-600 flex-shrink-0' />
                                <a
                                    href='https://wa.me/+917994470688'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm lg:text-base text-green-600 hover:text-green-700 transition-colors font-medium'
                                >
                                    WhatsApp Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8 pt-6 border-t'>
                    <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
                        <p className='text-sm text-muted-foreground'>© 2026 Geriacare.in. All rights reserved.</p>
                        <p className='text-sm text-muted-foreground text-center sm:text-right'>
                            <strong>Disclaimer:</strong> This website provides general guidance only. Not a substitute
                            for professional medical advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
