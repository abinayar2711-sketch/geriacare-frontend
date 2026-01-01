import { AboutContent } from '@/components/about/AboutContent';
import { Disclaimer } from '@/components/about/Disclaimer';

export const AboutPage = () => {
    return (
        <div className='space-y-12 lg:space-y-16'>
            <AboutContent />
            <Disclaimer />
        </div>
    );
};
