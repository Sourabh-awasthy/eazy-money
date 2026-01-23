"use client";
import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

interface StockPrice {
  symbol: string;
  price: string;
}

export default function Dashboard() {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // 1. Listen for the 'price-update' event we defined in the backend
    socket.on("price-update", (data: StockPrice) => {
      setPrices((prev) => ({
        ...prev,
        [data.symbol]: data.price,
      }));
    });

    // 2. Cleanup on unmount
    return () => {
      socket.off("price-update");
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Live Market Data</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(prices).map(([symbol, price]) => (
          <div key={symbol} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-gray-500 font-medium">{symbol}</h2>
            <p className="text-xl font-mono font-bold">${parseFloat(price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}