"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "buy" | "sell";
    symbol: string;
    price: number;
    walletBalance: number;
    onTradeSuccess: (newBalance: number) => void; 
}

export default function TradeModal({ 
    isOpen, 
    onClose, 
    type, 
    symbol, 
    price, 
    walletBalance, 
    onTradeSuccess 
}: TradeModalProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tradeMessage, setTradeMessage] = useState("");

    if (!isOpen) return null;

    const totalPrice = price * quantity;
    const isInsufficientFunds = type === "buy" && totalPrice > walletBalance;

    const executeTrade = async () => {
        if(quantity <= 0 || quantity > 100000) {
            setTradeMessage("Quantity must be between 1 and 100,000.");
            return;
        }
        setIsProcessing(true);
        setTradeMessage("");

        try {
            const token = localStorage.getItem("eazyToken");
            if (!token) {
                setTradeMessage("Please log in to execute trades.");
                setIsProcessing(false);
                return;
            }
            const endpoint = type === "buy" ? "/api/trade/buy" : "/api/trade/sell";
            
            const response = await axios.post(`http://localhost:8080${endpoint}`, {
                symbol,
                price,
                quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTradeMessage(`Successfully ${type === "buy" ? "bought" : "sold"} ${quantity} shares of ${symbol}!`);
            
            if (response.data.newBalance !== undefined) {
                onTradeSuccess(response.data.newBalance);
            }

            setTimeout(() => {
                onClose();
                setQuantity(1);
                setTradeMessage("");
            }, 2000);

        } catch (err) { 
            if (axios.isAxiosError(err)) {
                setTradeMessage(err.response?.data?.message || "Trade failed. Please try again.");
            } 
            else if (err instanceof Error) {
                setTradeMessage(err.message);
            } 
            else {
                setTradeMessage("An unexpected error occurred.");
            }
        }finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 capitalize text-gray-900 dark:text-white">
                    {type} {symbol}
                </h2>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                        <span>Current Price:</span>
                        <span className="font-semibold">${price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span>Quantity:</span>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded p-1 w-20 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-between border-t pt-4 font-bold text-lg">
                        <span>Total Cost:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Wallet Balance:</span>
                        <span className={isInsufficientFunds ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                            ${walletBalance.toFixed(2)}
                        </span>
                    </div>
                </div>

                {tradeMessage && (
                    <div className={`mt-4 p-2 text-center text-sm font-bold rounded ${tradeMessage.includes("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {tradeMessage}
                    </div>
                )}

                <div className="mt-6">
                    {isInsufficientFunds ? (
                        <button 
                            onClick={() => router.push('/profile')}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Insufficient Funds. Add Money →
                        </button>
                    ) : (
                        <button 
                            onClick={executeTrade}
                            disabled={isProcessing}
                            className={`w-full font-bold py-2 px-4 rounded transition-colors text-white 
                                ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                                ${type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                            `}
                        >
                            {isProcessing ? "Processing..." : `Confirm ${type}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}