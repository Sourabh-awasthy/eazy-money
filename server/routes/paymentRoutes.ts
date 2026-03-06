// routes/paymentRoutes.ts
import express from "express";
import { createPaymentIntent, updateWallet } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-intent", authMiddleware, createPaymentIntent);

router.post("/update-wallet", authMiddleware, updateWallet);

export default router;