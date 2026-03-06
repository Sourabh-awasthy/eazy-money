"use client"
import { useEffect, useState } from "react";
import { StockCard, StockCardProps } from "./components/StockCard";
import Navbar from "./components/NavBar";
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

  const handleOnBuy = (symbol: string, price: number) => {
    
    console.log("Buy", symbol, price);
    // socket.emit("buy", symbol, price);
  }
  const handleOnSell = (symbol: string, price: number) => {
    console.log("Sell", symbol, price);
    // socket.emit("sell", symbol, price);
  }

  return (
    <div className="flex flex-col justify-center bg-red-50 font-sans dark:bg-black">
        <Navbar />
      {
        Object.values(stockList).map((stock) => (
          <StockCard 
            key = {stock.symbol}
            symbol = {stock.symbol}
            price = {stock.price}
            onBuy={() => handleOnBuy(stock.symbol, stock.price)}
            onSell={() => handleOnSell(stock.symbol, stock.price)}
          />
        ))
      }
    </div>
  );
}
