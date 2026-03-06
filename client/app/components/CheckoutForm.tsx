"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { isLoggedIn } = useAuth();
    
    const [amount, setAmount] = useState(50); // Default to adding $50
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !isLoggedIn) return;

        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("eazyToken");
            const amountInCents = amount * 100;

            // 1. Ask backend for the Client Secret
            const intentRes = await axios.post(
                "http://localhost:8080/api/payment/create-intent",
                { amount: amountInCents },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { clientSecret } = intentRes.data;

            // 2. Confirm the card payment securely via Stripe.js
            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement! },
            });

            if (paymentResult.error) {
                setMessage(`Payment failed: ${paymentResult.error.message}`);
                setLoading(false);
                return;
            }

            // 3. If successful, tell our backend to update the MongoDB wallet balance
            if (paymentResult.paymentIntent.status === "succeeded") {
                await axios.post(
                    "http://localhost:8080/api/payment/update-wallet",
                    { 
                        paymentIntentId: paymentResult.paymentIntent.id,
                        amount: amountInCents
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setMessage("Success! Wallet funded.");
                // Optional: trigger a profile refetch here to update the UI
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred during checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 p-4 border rounded shadow">
            <h2 className="text-xl font-bold">Add Funds to Wallet</h2>
            
            <label>Amount ($)</label>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="border p-2 rounded"
                min="1"
            />

            <div className="p-3 border rounded bg-white">
                <CardElement options={{ hidePostalCode: true }} />
            </div>

            <button 
                type="submit" 
                disabled={!stripe || loading}
                className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay $${amount}`}
            </button>
            
            {message && <p className="text-center font-bold text-sm mt-2">{message}</p>}
        </form>
    );
}