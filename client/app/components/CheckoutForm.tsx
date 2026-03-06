"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface CheckoutFormProps {
    onPaymentSuccess: () => void;
}

export default function CheckoutForm({ onPaymentSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { isLoggedIn } = useAuth();
    
    const [amount, setAmount] = useState(50); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !isLoggedIn) return;

        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("eazyToken");
            if(amount <= 0 || amount > 50000) {
                setMessage("Invalid amount. Please enter an amount between 1 and 50,000.");
                setLoading(false);
                return;
            }
            const amountInPaise = amount * 100; 

            const intentRes = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-intent`,
                { amount: amountInPaise },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { clientSecret } = intentRes.data;

            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { 
                    card: cardElement!,
                    billing_details: {
                        name: "Test User",
                        address: {
                            line1: "123 Test Street",
                            city: "Mumbai",
                            state: "MH",
                            postal_code: "400001",
                            country: "IN",
                        }
                    }
                },
            });

            if (paymentResult.error) {
                setMessage(`Payment failed: ${paymentResult.error.message}`);
                setLoading(false);
                return;
            }

            if (paymentResult.paymentIntent.status === "succeeded") {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/update-wallet`,
                    { 
                        paymentIntentId: paymentResult.paymentIntent.id,
                        amount: amountInPaise
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setMessage("Success! Wallet funded.");
                setAmount(50); 
                
                onPaymentSuccess(); 
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred during checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Add Funds</h2>
            
            <label className="text-sm font-semibold text-gray-700">Amount</label>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                min="1"
            />

            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-200">
                <p className="font-semibold mb-1">Use this Test Card:</p>
                <p><strong>Number:</strong> 4000 0035 6000 0008</p>
                <p><strong>Expiry:</strong> 12/30 &nbsp; | &nbsp; <strong>CVV:</strong> 123</p>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
                <CardElement options={{ hidePostalCode: true }} />
            </div>

            <button 
                type="submit" 
                disabled={!stripe || loading}
                className="bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {loading ? "Processing..." : `Pay $${amount}`}
            </button>
            
            {message && (
                <p className={`text-center font-bold text-sm mt-2 ${message.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}