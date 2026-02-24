import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const login = (email: string, password: string): boolean => {
        const foundUser = users.find(
            u => u.email === email && u.password === password 
        );

        if (!foundUser) return false;

        setUser(foundUser);
        return true;
    };

    const register = (name: string, email: string, password: string): boolean => {
        const exist = users.some(u => u.email === email);

        if (exist) return false;

        const newUser: User = { name, email, password };
        setUsers(prev => [...prev, newUser]);

        return true;
    }

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
