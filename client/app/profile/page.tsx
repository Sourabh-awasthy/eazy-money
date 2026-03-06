"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm"; 

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UserProfile {
    _id: string;
    email: string;
    walletBalance?: number;
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

            const response = await axios.get(`http://localhost:8080/api/user/profile`, {
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
        <div className="flex flex-col items-center mt-10 mb-20 gap-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            
            {profile && (
                <div className="bg-white shadow-md rounded-lg p-6 w-80 border border-gray-700">
                    <p className="mb-2 text-gray-700">
                        <span className="font-semibold text-gray-900">Email:</span> {profile.email}
                    </p>
                    <p className="mb-2 text-gray-700">
                        <span className="font-semibold text-gray-900">User ID:</span> {profile._id}
                    </p>
                    {profile.walletBalance !== undefined && (
                        <p className="mt-4 pt-4 border-t border-gray-700 font-bold text-green-600">
                            Wallet Balance: ${profile.walletBalance.toFixed(2)}
                        </p>
                    )}
                </div>
            )}

            <div className="w-80">
                <Elements stripe={stripePromise}>
                    <CheckoutForm onPaymentSuccess={fetchProfile} />
                </Elements>
            </div>
        </div>
    );
}