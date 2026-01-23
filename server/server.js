import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cors from 'cors'

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


server.listen(PORT, () =>{
    console.log(`Server running at ${PORT}`);
})


