
export interface StockCardProps{
    symbol: string;
    price: number;
    onBuy?(): void;
    onSell?(): void;
}

export function StockCard({symbol, price, onBuy, onSell} : StockCardProps){
    return(
        <div className="flex h-40 p-8">
            <div className="flex-col flex-1 p-8 items-center">
                <h2 className="text-2xl">
                    {symbol}
                </h2>
                <h3 className="text-xl">
                    ${price && price.toFixed(2)}
                </h3>
            </div>
            <div className="flex flex-1 p-4">
                <button onClick = {onBuy} className="flex-1 m-1 rounded bg-green-500 hover:bg-green-600 transition cursor-pointer">
                    Buy
                </button>
                <button onClick = {onSell} className="flex-1 m-1 rounded bg-red-500 hover:bg-red-600 transition cursor-pointer">
                    Sell
                </button>
            </div>
        </div>
    )
}