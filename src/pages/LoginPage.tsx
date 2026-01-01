import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/auth';
import type { LoginRequest } from '@/types/user';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the intended destination or default to home
    const from = location.state?.from?.pathname || '/';

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: () => {
            navigate(from, { replace: true });
        },
        onError: error => {
            console.error('Login failed:', error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            return;
        }

        loginMutation.mutate({
            email: email.trim(),
            password: password.trim()
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-6'>
                <div className='text-center'>
                    <Link
                        to='/'
                        className='inline-flex items-center text-blue-600 hover:text-blue-700 mb-6'
                    >
                        <ArrowLeft className='h-5 w-5 mr-2' />
                        Back to Home
                    </Link>
                    <h1 className='text-3xl font-bold text-gray-900'>Welcome back</h1>
                    <p className='mt-2 text-gray-600'>Sign in to your Geriacare account</p>
                </div>

                <Card className='shadow-xl'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold text-center'>Sign In</CardTitle>
                        <CardDescription className='text-center'>
                            Access your account to manage care questions and connect with caregivers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className='space-y-4'
                        >
                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email Address</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                    required
                                    className='h-12 text-base'
                                    disabled={loginMutation.isPending}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='password'>Password</Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                        required
                                        className='h-12 text-base pr-12'
                                        disabled={loginMutation.isPending}
                                    />
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
                                        onClick={togglePasswordVisibility}
                                        disabled={loginMutation.isPending}
                                    >
                                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                        <span className='sr-only'>
                                            {showPassword ? 'Hide password' : 'Show password'}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {loginMutation.isError && (
                                <Alert variant='destructive'>
                                    <AlertCircle className='h-4 w-4' />
                                    <AlertDescription>
                                        {loginMutation.error instanceof Error
                                            ? loginMutation.error.message
                                            : 'Login failed. Please check your credentials and try again.'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type='submit'
                                className='w-full h-12 text-base font-medium'
                                disabled={loginMutation.isPending || !email.trim() || !password.trim()}
                            >
                                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className='mt-6 text-center'>
                            <p className='text-sm text-gray-600'>
                                Don't have an account?{' '}
                                <Link
                                    to='/register'
                                    className='text-blue-600 hover:text-blue-700 font-medium'
                                >
                                    Create one here
                                </Link>
                            </p>
                        </div>

                        <div className='mt-4 text-center'>
                            <Link
                                to='/forgot-password'
                                className='text-sm text-blue-600 hover:text-blue-700'
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className='text-center text-sm text-gray-500'>
                    <p>
                        By signing in, you agree to our{' '}
                        <Link
                            to='/terms'
                            className='text-blue-600 hover:text-blue-700'
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            to='/privacy'
                            className='text-blue-600 hover:text-blue-700'
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
