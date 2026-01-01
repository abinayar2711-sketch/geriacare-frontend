import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Menu, Phone, MessageCircle, User, LogOut, Settings } from 'lucide-react';
import { authService } from '@/services/auth';
import { getStoredUser, isAuthenticated, isAdmin } from '@/lib/api';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Ask Question', href: '/questions' },
    { name: 'Insights', href: '/insights' },
    { name: 'Caregivers', href: '/caregivers' },
    { name: 'Feedback', href: '/feedback' },
    { name: 'Contact', href: '/contact' }
];

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const authenticated = isAuthenticated();
    const user = getStoredUser();
    const userIsAdmin = isAdmin(user);

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            navigate('/', { replace: true });
        },
        onError: error => {
            console.error('Logout failed:', error);
            // Force logout even if API call fails
            navigate('/', { replace: true });
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 lg:h-20 items-center justify-between'>
                    {/* Logo */}
                    <Link
                        to='/'
                        className='flex items-center space-x-2'
                    >
                        <div className='flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-full'>
                            <Heart className='h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground fill-current' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-lg lg:text-xl font-bold text-primary'>Geriacare</span>
                            <span className='text-xs lg:text-sm text-muted-foreground hidden sm:block'>
                                Trusted care for seniors 70+
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex lg:items-center lg:space-x-1'>
                        {navigation.map(item => (
                            <Link
                                key={item.name}
                                to={item.href}
                            >
                                <Button
                                    variant={location.pathname === item.href ? 'default' : 'ghost'}
                                    className='text-base px-4 py-2 h-auto'
                                >
                                    {item.name}
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className='hidden lg:flex items-center space-x-4'>
                        {/* Emergency Contact */}
                        <div className='flex items-center space-x-3'>
                            <a
                                href='https://wa.me/+919876543210'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center space-x-2 text-green-600 hover:text-green-700'
                            >
                                <MessageCircle className='h-5 w-5' />
                                <span className='font-medium'>WhatsApp</span>
                            </a>
                            <div className='h-6 w-px bg-border' />
                            <a
                                href='tel:+919876543210'
                                className='flex items-center space-x-2 text-primary hover:text-primary/80'
                            >
                                <Phone className='h-5 w-5' />
                                <span className='font-medium'>Emergency</span>
                            </a>
                        </div>

                        {/* Authentication */}
                        {authenticated && user ? (
                            <div className='flex items-center space-x-2'>
                                <div className='h-6 w-px bg-border' />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='relative h-10 w-10 rounded-full p-0'
                                        >
                                            <Avatar className='h-10 w-10'>
                                                <AvatarFallback className='bg-primary text-primary-foreground'>
                                                    {getUserInitials(user.name || user.email)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                        className='w-56'
                                    >
                                        <div className='flex flex-col space-y-1 p-2'>
                                            <p className='text-sm font-medium'>{user.name || 'User'}</p>
                                            <p className='text-xs text-muted-foreground'>{user.email}</p>
                                            {userIsAdmin && (
                                                <p className='text-xs text-blue-600 font-medium'>Administrator</p>
                                            )}
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to='/profile'
                                                className='flex items-center'
                                            >
                                                <User className='mr-2 h-4 w-4' />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        {userIsAdmin && (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    to='/admin'
                                                    className='flex items-center'
                                                >
                                                    <Settings className='mr-2 h-4 w-4' />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            disabled={logoutMutation.isPending}
                                            className='flex items-center text-red-600'
                                        >
                                            <LogOut className='mr-2 h-4 w-4' />
                                            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-2'>
                                <div className='h-6 w-px bg-border' />
                                <Button
                                    asChild
                                    variant='outline'
                                >
                                    <Link to='/login'>Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link to='/register'>Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                className='lg:hidden'
                            >
                                <Menu className='h-6 w-6' />
                                <span className='sr-only'>Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side='right'
                            className='w-[300px] sm:w-[400px]'
                        >
                            <nav className='flex flex-col space-y-4 mt-6'>
                                {navigation.map(item => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant={location.pathname === item.href ? 'default' : 'ghost'}
                                            className='w-full justify-start text-lg py-3 h-auto'
                                        >
                                            {item.name}
                                        </Button>
                                    </Link>
                                ))}

                                {/* Account section - Mobile */}
                                {authenticated && user ? (
                                    <div className='pt-6 border-t space-y-3'>
                                        <h3 className='font-medium text-foreground'>Account</h3>
                                        <div className='flex items-center space-x-3 p-3 rounded-lg bg-accent/50'>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarFallback className='bg-primary text-primary-foreground text-sm'>
                                                    {getUserInitials(user.name || user.email)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className='text-sm font-medium'>{user.name || 'User'}</p>
                                                <p className='text-xs text-muted-foreground'>{user.email}</p>
                                                {userIsAdmin && (
                                                    <p className='text-xs text-blue-600 font-medium'>Administrator</p>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            to='/profile'
                                            onClick={() => setMobileMenuOpen(false)}
                                            className='flex items-center space-x-3 text-foreground hover:text-primary p-3 rounded-lg hover:bg-accent'
                                        >
                                            <User className='h-6 w-6' />
                                            <span className='text-lg font-medium'>Profile</span>
                                        </Link>
                                        {userIsAdmin && (
                                            <Link
                                                to='/admin'
                                                onClick={() => setMobileMenuOpen(false)}
                                                className='flex items-center space-x-3 text-foreground hover:text-primary p-3 rounded-lg hover:bg-accent'
                                            >
                                                <Settings className='h-6 w-6' />
                                                <span className='text-lg font-medium'>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            disabled={logoutMutation.isPending}
                                            variant='destructive'
                                            className='w-full justify-start text-lg py-3 h-auto'
                                        >
                                            <LogOut className='h-6 w-6 mr-3' />
                                            {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='pt-6 border-t space-y-3'>
                                        <h3 className='font-medium text-foreground'>Account</h3>
                                        <Link
                                            to='/login'
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button
                                                variant='outline'
                                                className='w-full justify-start text-lg py-3 h-auto'
                                            >
                                                <User className='h-6 w-6 mr-3' />
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link
                                            to='/register'
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button className='w-full justify-start text-lg py-3 h-auto'>
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Emergency Contact - Mobile */}
                                <div className='pt-6 border-t space-y-3'>
                                    <h3 className='font-medium text-foreground'>Emergency Contact</h3>
                                    <a
                                        href='https://wa.me/+919876543210'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center space-x-3 text-green-600 hover:text-green-700 p-3 rounded-lg hover:bg-accent'
                                    >
                                        <MessageCircle className='h-6 w-6' />
                                        <span className='text-lg font-medium'>WhatsApp Support</span>
                                    </a>
                                    <a
                                        href='tel:+919876543210'
                                        className='flex items-center space-x-3 text-primary hover:text-primary/80 p-3 rounded-lg hover:bg-accent'
                                    >
                                        <Phone className='h-6 w-6' />
                                        <span className='text-lg font-medium'>Call Emergency</span>
                                    </a>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};
