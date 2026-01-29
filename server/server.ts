import dotenv from 'dotenv'
dotenv.config();


import express from 'express'
import http from 'http'
import cors from 'cors'
import { initTwelveDataSocket } from './socket/twelveData'
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes'
import connectDB from './config/db'

connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const FRONTEND = process.env.FRONTEND


app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);


const io = new Server(server, {
    cors: {
        origin: FRONTEND,
        methods: ["GET", "POST"]
    }
})

initTwelveDataSocket(io);

server.listen(PORT, () =>{
    console.log(`Server running at ${PORT}`);
})


