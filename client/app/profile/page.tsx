"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm"; 
import NavBar from "../components/NavBar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PortfolioItem {
    _id?: string;
    symbol: string;
    quantity: number;
    avgPrice: number;
}

interface UserProfile {
    _id: string;
    email: string;
    walletBalance?: number;
    portfolio?: PortfolioItem[];
}

export default function ProfilePage() {
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("eazyToken");
            if (!token) {
                setError("No authentication token found. Please log in again.");
                setPageLoading(false);
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfile(response.data);
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError("Failed to load profile data. Please try logging in again.");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        fetchProfile();
    }, [isLoggedIn, authLoading, router]);

    if (authLoading || pageLoading) {
        return <div className="flex justify-center p-10 mt-10 text-xl">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    return (
        <>
        <NavBar />
        <div className="flex flex-col items-center mt-10 mb-20 gap-8 px-4">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            
            <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-4xl justify-center">
                
                {/* LEFT COLUMN: User Info & Stripe Form */}
                <div className="flex flex-col gap-8 w-80">
                    {profile && (
                        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                            <p className="mb-2 text-gray-700">
                                <span className="font-semibold text-gray-900">Email:</span> {profile.email}
                            </p>
                            <p className="mb-2 text-gray-700">
                                <span className="font-semibold text-gray-900">User ID:</span> {profile._id}
                            </p>
                            {profile.walletBalance !== undefined && (
                                <p className="mt-4 pt-4 border-t border-gray-200 font-bold text-green-600">
                                    Wallet Balance: ${profile.walletBalance.toFixed(2)}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="w-full">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm onPaymentSuccess={fetchProfile} />
                        </Elements>
                    </div>
                </div>

                {/* RIGHT COLUMN: Current Holdings (Portfolio) */}
                {profile && profile.portfolio && (
                    <div className="w-full md:w-[500px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-800 text-white p-4">
                            <h2 className="text-xl font-bold">Current Holdings</h2>
                        </div>
                        
                        {profile.portfolio.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                You do not own any stocks yet. Go buy some!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                                            <th className="p-3">Symbol</th>
                                            <th className="p-3">Qty</th>
                                            <th className="p-3">Avg Price</th>
                                            <th className="p-3">Invested</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profile.portfolio.map((stock, idx) => (
                                            <tr key={stock._id || idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-bold text-gray-900">{stock.symbol}</td>
                                                <td className="p-3 text-gray-700">{stock.quantity}</td>
                                                <td className="p-3 text-gray-700">${stock.avgPrice.toFixed(2)}</td>
                                                <td className="p-3 font-semibold text-gray-900">
                                                    ${(stock.quantity * stock.avgPrice).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}