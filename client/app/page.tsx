"use client"
import { useEffect, useState } from "react";
import { StockCard, StockCardProps } from "./components/stockCard";
import { socket } from "./lib/socket";


export default function Home() {

  const [stockList, setStockList] = useState<{ [key: string]: StockCardProps }>({});

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

  return (
    <div className="flex flex-col justify-center bg-red-50 font-sans dark:bg-black">
      <h1 className="text-4xl text-center">
        Welcome to Eazy Trading
      </h1>
      {
        Object.values(stockList).map((stock) => (
          <StockCard 
            key = {stock.symbol}
            symbol = {stock.symbol}
            price = {stock.price}
          />
        ))
      }
    </div>
  );
}
