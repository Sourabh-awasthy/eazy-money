import WebSocket from 'ws'
import { Server } from 'socket.io'

const SYMBOLS = "AAPL,TRP,QQQ,EUR/USD,BTC/USD,AED/ARS,AED/INR"

let reconnectAttempts = 0;
let heartBeatInterval : NodeJS.Timeout

export const initTwelveDataSocket = (io : Server) => {
    const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
    
    const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${TWELVE_DATA_API_KEY}`);

    ws.on('open', () => {
        console.log("Backend connection to ws");

        ws.send(JSON.stringify({
            "action": "subscribe",
            "params": {"symbols": SYMBOLS}
        }));
    });

    ws.on('message', (data : string) => {
        const message = JSON.parse(data);

        if(message.event === 'price'){
            console.log(`Live Data >> ${message.symbol} : ${message.price}`)
            io.emit('price-update', {
                symbol: message.symbol,
                price: message.price
            })
        }
    });

    ws.on('error', (err) => console.error("Connection ne dediya error : ",err.message));

    ws.on('close', () => {
        console.error("Connection band hogya, retrying");
        setTimeout(initTwelveDataSocket, 6000);
    });
};