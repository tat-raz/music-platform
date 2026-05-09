import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";


interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to='/signin' replace />
    }

    return <>{children}</>;
};