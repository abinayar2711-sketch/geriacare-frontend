import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser, isAuthenticated, isAdmin } from '@/lib/api';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: ProtectedRouteProps) => {
    const location = useLocation();
    const authenticated = isAuthenticated();
    const user = getStoredUser();
    const userIsAdmin = isAdmin(user);

    // Check authentication
    if (requireAuth && !authenticated) {
        return (
            <Navigate
                to='/login'
                state={{ from: location }}
                replace
            />
        );
    }

    // Check admin role
    if (requireAdmin && !userIsAdmin) {
        return (
            <Navigate
                to='/'
                replace
            />
        );
    }

    return <>{children}</>;
};
