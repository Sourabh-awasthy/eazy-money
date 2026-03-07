# Eazy Trade 📈
**A Full-Stack Real-Time Paper Trading Application**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://eazy-trade.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/Sourabh-awasthy/eazy-money)

Eazy Trade is a simulated paper trading platform that allows users to experience the thrill of the cryptocurrency markets without financial risk. Built with a modern Next.js and Node.js architecture, the platform features real-time data streaming, virtual wallet management, and secure simulated payment gateways.

---

## ✨ Features

- **Real-Time Market Data:** Integrated **Socket.io** and the **Twelve Data API** to stream low-latency, live pricing for cryptocurrencies directly to the client.
- **Risk-Free Paper Trading:** Users can execute buy/sell orders in a simulated environment that mirrors live market conditions.
- **Virtual Wallet Top-Ups:** Integrated the **Stripe API** (Checkout Sessions) to securely process simulated account funding.
- **Full-Stack Architecture:** Decoupled Next.js frontend and Express.js backend, ensuring scalable performance and secure API routing.
- **Secure Authentication & Management:** Robust REST APIs handle user sessions, trade history, and portfolio tracking.

---

## 🛠 Tech Stack

### Frontend (`/client`)
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / CSS
- **Real-Time Client:** Socket.io-client
- **Deployment:** Vercel

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-Time Server:** Socket.io
- **Payment Processing:** Stripe API
- **Market Data:** Twelve Data API
- **Language:** TypeScript
- **Deployment:** Vercel

---

## 🚀 Getting Started

To run this project locally, you will need to start both the client and the server.

### Prerequisites
- Node.js (v16+ recommended)
- A [Stripe](https://stripe.com/) Developer Account (for test API keys)
- A [Twelve Data](https://twelvedata.com/) Account (for API keys)

### 1. Clone the repository
```bash
git clone https://github.com/Sourabh-awasthy/eazy-money.git
cd eazy-money
```

### 2. Setup the Server (Backend)
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory and add your keys:
```env
PORT=5000
FRONTEND=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_test_key
TWELVE_DATA_API_KEY=your_twelve_data_key
# Add your database URI or other secret keys here
```

Run the backend development server:
```bash
npm run dev
```

### 3. Setup the Client (Frontend)
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `/client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

Run the frontend development server:
```bash
npm run dev
```
The app should now be running locally at `http://localhost:3000`.

---

## 📡 API & Socket Architecture

### REST API Routes
- `POST /api/auth` - Handles user registration, login, and session tokens.
- `GET /api/user` - Fetches user portfolio, current balance, and settings.
- `POST /api/trade` - Processes buy and sell orders, validating against current virtual wallet balance.
- `POST /api/payment` - Generates Stripe Checkout sessions for virtual wallet top-ups.

### Real-Time Sockets
- The server maintains a persistent WebSocket connection with the frontend using **Socket.io**.
- Emits live pricing updates polled from the **Twelve Data API** to keep the UI perfectly synchronized with the market without overwhelming the client with HTTP requests.

---

## 📁 Project Structure

```text
eazy-money/
├── client/                 # Next.js Frontend
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # Reusable UI components (e.g., StockCard)
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Route logic (Auth, Trade, Payment)
│   ├── routes/             # API endpoint definitions
│   ├── server.ts           # Entry point & Socket.io setup
│   └── package.json
└── README.md
```

---

## 💡 Developer Notes
- Ensure that `.env` and `.env.local` files are added to your `.gitignore` to prevent leaking sensitive API keys.
- If a database (like MongoDB or PostgreSQL) is integrated in the future, ensure the connection string is safely stored in the backend `.env`.

---

## 👨‍💻 Author

**Sourabh Awasthy**
- GitHub: [@Sourabh-awasthy](https://github.com/Sourabh-awasthy)
- Live Project: [Eazy Trade](https://eazy-money.vercel.app)

---

> **Note:** Contributors are most welcome ... No real money is traded, and Stripe operates strictly in test mode.