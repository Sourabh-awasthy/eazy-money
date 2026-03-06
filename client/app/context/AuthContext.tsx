"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        isLoading: true,
    });
    
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem("eazyToken");
            
            setAuthState({
                isLoggedIn: !!token,
                isLoading: false, 
            });
        };

        initializeAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem("eazyToken", token);
        setAuthState({ isLoggedIn: true, isLoading: false });
    };

    const logout = () => {
        localStorage.removeItem("eazyToken");
        setAuthState({ isLoggedIn: false, isLoading: false });
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};