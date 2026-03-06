"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// 1. Define what data our Context will hold
interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean; // Tells us if we are still checking localStorage
    login: (token: string) => void;
    logout: () => void;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Combine isLoading and isLoggedIn into a single state object
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        isLoading: true,
    });
    
    const router = useRouter();

    useEffect(() => {
        // 2. Wrap the logic in a function to abstract it from the raw effect body
        const initializeAuth = () => {
            const token = localStorage.getItem("eazyToken");
            
            // 3. Do ONE single state update to avoid cascading renders
            setAuthState({
                isLoggedIn: !!token, // Converts token to true if it exists, false if null
                isLoading: false,    // We are done loading
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
        // 4. Spread the authState object so the Context still provides the exact same variables
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Create a custom hook so we don't have to import useContext everywhere
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};