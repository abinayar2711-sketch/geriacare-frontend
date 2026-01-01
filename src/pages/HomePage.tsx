import { Hero } from '@/components/home/Hero';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';

export const HomePage = () => {
    return (
        <div className='space-y-12 lg:space-y-16'>
            <Hero />
            <FeaturesGrid />
        </div>
    );
};
