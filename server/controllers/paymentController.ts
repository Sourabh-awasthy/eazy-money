import { Response } from "express";
import Stripe from "stripe";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover", 
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body; 

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            metadata: { userId: req.userId! }, 
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: "Error creating payment intent", error });
    }
};

export const updateWallet = async (req: AuthRequest, res: Response) => {
    try {
        const { paymentIntentId, amount } = req.body;
        const userId = req.userId;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment not successful" });
        }

        const dollarsAdded = amount / 100;
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { walletBalance: dollarsAdded } },
            { new: true }
        ).select("-password");

        res.status(200).json({ message: "Wallet updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating wallet", error });
    }
};