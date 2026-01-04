import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    userName: string;
    email: string;
    mobile?: string;
    profileImage?: string;
    isPasswordChangeRequired?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string, mobile?: string) => Promise<void>;
    logout: () => void;
    verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = storedToken;
            verifyToken();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean = false) => {
        try {
            const response = await axios.post('/auth/login', {
                email,
                password,
                rememberMe,
            });

            const { accessToken, userData } = response.data;

            setToken(accessToken);
            setUser(userData);
            localStorage.setItem('accessToken', accessToken);
            axios.defaults.headers.common['Authorization'] = accessToken;

            toast({
                title: 'Success',
                description: 'Logged in successfully',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const signup = async (firstName: string, lastName: string, email: string, password: string, mobile?: string) => {
        try {
            const response = await axios.post('/auth/signup', {
                firstName,
                lastName,
                email,
                password,
                mobile,
            });

            const { accessToken, userData } = response.data;

            setToken(accessToken);
            setUser(userData);
            localStorage.setItem('accessToken', accessToken);
            axios.defaults.headers.common['Authorization'] = accessToken;

            toast({
                title: 'Success',
                description: 'Account created successfully',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common['Authorization'];

        toast({
            title: 'Logged out',
            description: 'You have been logged out successfully',
        });
    };

    const verifyToken = async () => {
        try {
            const response = await axios.get('/auth/verify-token');
            setUser(response.data.userData);
        } catch (error) {
            // Token is invalid, clear it
            setToken(null);
            setUser(null);
            localStorage.removeItem('accessToken');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    return <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, verifyToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
