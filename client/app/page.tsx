"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { StockCard, StockCardProps } from "./components/StockCard";
import Navbar from "./components/NavBar";
import TradeModal from "./components/TradeModal"; // Import your new modal
import { socket } from "./lib/socket";

export default function Home() {
    const [stockList, setStockList] = useState<{ [key: string]: StockCardProps }>({});
    
    // Simplified Modal State
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: "buy" | "sell"; symbol: string } | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);

    useEffect(() => {
        const handlePriceUpdate = (data: StockCardProps) => {
            setStockList((prev) => ({
                ...prev,
                [data.symbol]: { ...prev[data.symbol], ...data }
            }));
        };

        socket.on("price-update", handlePriceUpdate);

        return () => {
            socket.off("price-update", handlePriceUpdate);
        }
    }, []);

    const handleTradeClick = async (type: "buy" | "sell", symbol: string) => {
        setModalConfig({ isOpen: true, type, symbol });

        try {
            const token = localStorage.getItem("eazyToken");
            if(!token) {
                setWalletBalance(0);
                return;
            }
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWalletBalance(res.data.walletBalance || 0);
        } catch (err) {
            console.error("Failed to fetch balance", err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-red-50 font-sans dark:bg-black relative">
            <Navbar />
            
            <div className="flex flex-col flex-wrap justify-center gap-4 p-4">
                {Object.values(stockList).map((stock) => (
                    <StockCard 
                        key={stock.symbol}
                        symbol={stock.symbol}
                        price={stock.price}
                        onBuy={() => handleTradeClick("buy", stock.symbol)}
                        onSell={() => handleTradeClick("sell", stock.symbol)}
                    />
                ))}
            </div>

            {/* Render the extracted TradeModal */}
            {modalConfig?.isOpen && stockList[modalConfig.symbol] && (
                <TradeModal 
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig(null)}
                    type={modalConfig.type}
                    symbol={modalConfig.symbol}
                    price={stockList[modalConfig.symbol].price} // Passes the live socket price!
                    walletBalance={walletBalance}
                    onTradeSuccess={(newBalance) => setWalletBalance(newBalance)}
                />
            )}
        </div>
    );
}