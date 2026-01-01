import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { LoginPage } from '@/pages/LoginPage';
import { QuestionsPage } from '@/pages/QuestionsPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import FeedbackPage from '@/pages/FeedbackPage';
import CaregiversPage from '@/pages/CaregiversPage';
import InsightsPage from '@/pages/InsightsPage';
import ManageFeedbackPage from '@/pages/admin/ManageFeedbackPage';
import ManageCaregiversPage from '@/pages/admin/ManageCaregiversPage';
import ManageInsightsPage from '@/pages/admin/ManageInsightsPage';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10 // 10 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
            >
                <Router>
                    <div className='min-h-screen bg-background font-sans antialiased'>
                        <Routes>
                            {/* Authentication routes */}
                            <Route
                                path='/login'
                                element={<LoginPage />}
                            />
                            <Route
                                path='/register'
                                element={
                                    <ComingSoonPage
                                        title='Create Account'
                                        description='Join Geriacare to get personalized senior care guidance and connect with caregivers.'
                                        expectedFeatures={[
                                            'Create your account',
                                            'Secure login system',
                                            'Profile management',
                                            'Personalized recommendations',
                                            'Question history tracking'
                                        ]}
                                    />
                                }
                            />
                            <Route
                                path='/forgot-password'
                                element={
                                    <ComingSoonPage
                                        title='Reset Password'
                                        description='Reset your password to regain access to your account.'
                                        expectedFeatures={[
                                            'Password reset via email',
                                            'Secure token verification',
                                            'Set new password',
                                            'Account security notifications'
                                        ]}
                                    />
                                }
                            />

                            {/* Main app routes */}
                            <Route
                                path='/'
                                element={<MainLayout />}
                            >
                                <Route
                                    index
                                    element={<HomePage />}
                                />
                                <Route
                                    path='about'
                                    element={<AboutPage />}
                                />
                                <Route
                                    path='questions'
                                    element={<QuestionsPage />}
                                />
                                <Route
                                    path='insights'
                                    element={<InsightsPage />}
                                />
                                <Route
                                    path='caregivers'
                                    element={<CaregiversPage />}
                                />
                                <Route
                                    path='feedback'
                                    element={<FeedbackPage />}
                                />
                                <Route
                                    path='contact'
                                    element={
                                        <ComingSoonPage
                                            title='Contact Us'
                                            description='Get in touch with our team for support and inquiries.'
                                            expectedFeatures={[
                                                'Contact form for inquiries',
                                                'WhatsApp direct contact',
                                                'Phone and email information',
                                                'Office location details',
                                                'Emergency contact guidelines'
                                            ]}
                                        />
                                    }
                                />

                                {/* Admin Routes */}
                                <Route
                                    path='admin/manage-feedback'
                                    element={<ManageFeedbackPage />}
                                />
                                <Route
                                    path='admin/manage-caregivers'
                                    element={<ManageCaregiversPage />}
                                />
                                <Route
                                    path='admin/manage-insights'
                                    element={<ManageInsightsPage />}
                                />

                                {/* Catch all route */}
                                <Route
                                    path='*'
                                    element={
                                        <ComingSoonPage
                                            title='Page Not Found'
                                            description="The page you're looking for doesn't exist or is still under development."
                                        />
                                    }
                                />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
