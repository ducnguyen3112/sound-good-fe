import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    tokenExpiredMessage: string;
    setTokenExpiredMessage: (message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


const isLogin = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};
const isTokenExpired = (): boolean => {
    const expiration = localStorage.getItem('exp');
    if (!expiration) {
        return true;
    }

    const now = new Date().getTime();
    return now > parseInt(expiration, 10);
};


export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isLogin());
    const [tokenExpiredMessage, setTokenExpiredMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isTokenExpired()) {
            setIsAuthenticated(false);
            setTokenExpiredMessage('Your session has expired. Please log in again.');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <AuthContext.Provider
            value={{isAuthenticated, setIsAuthenticated, tokenExpiredMessage, setTokenExpiredMessage}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
