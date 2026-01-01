import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => {
    return (
        <div className='min-h-screen flex flex-col bg-background'>
            <Header />
            <main className='flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
