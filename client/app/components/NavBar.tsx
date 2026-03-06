"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; 

export default function NavBar() {
    const { isLoggedIn, isLoading, logout } = useAuth();

    if (isLoading) {
        return <header className="p-4 border-b border-gray-300 h-[57px]"></header>;
    }

    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-300 h-[57px]">
            <div className="font-extrabold text-xl tracking-wide">
                <Link href="/">
                    EazyTrade
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <Link href="/profile" className="font-bold hover:text-blue-600 transition-colors">
                            Profile
                        </Link>
                        <button 
                            onClick={logout} 
                            className="font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="font-bold hover:text-blue-600 transition-colors">
                        Log in
                    </Link>
                )}
            </div>

            

        </header>
    );
}