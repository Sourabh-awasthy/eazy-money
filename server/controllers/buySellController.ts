import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware"; // Your extended Request type

export const buyStock = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { symbol, price, quantity } = req.body;

        if (!symbol || !price || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid trade data provided." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const totalCost = price * quantity;

        if (user.walletBalance < totalCost) {
            return res.status(400).json({ message: "Insufficient wallet balance." });
        }

        user.walletBalance -= totalCost;

        const stockIndex = user.portfolio.findIndex(p => p.symbol === symbol);

        if (stockIndex > -1) {
            const existingStock = user.portfolio[stockIndex];
            
            const totalPreviousCost = existingStock.quantity * existingStock.avgPrice;
            const newTotalCost = totalPreviousCost + totalCost;
            const newTotalQuantity = existingStock.quantity + quantity;
            
            user.portfolio[stockIndex].quantity = newTotalQuantity;
            user.portfolio[stockIndex].avgPrice = newTotalCost / newTotalQuantity;
        } else {
            user.portfolio.push({
                symbol,
                quantity,
                avgPrice: price
            });
        }

        await user.save();

        res.status(200).json({ 
            message: "Trade successful", 
            newBalance: user.walletBalance 
        });

    } catch (error) {
        console.error("Buy error:", error);
        res.status(500).json({ message: "Server error processing trade." });
    }
};

export const sellStock = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { symbol, price, quantity } = req.body;

        if (!symbol || !price || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid trade data provided." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const stockIndex = user.portfolio.findIndex(p => p.symbol === symbol);
        if (stockIndex === -1) {
            return res.status(400).json({ message: "You do not own this stock." });
        }

        const existingStock = user.portfolio[stockIndex];

        if (existingStock.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient shares to sell." });
        }

        const totalRevenue = price * quantity;
        user.walletBalance += totalRevenue; 

        existingStock.quantity -= quantity;

        if (existingStock.quantity === 0) {
            user.portfolio.splice(stockIndex, 1);
        }

        await user.save();

        res.status(200).json({ 
            message: "Trade successful", 
            newBalance: user.walletBalance 
        });

    } catch (error) {
        console.error("Sell error:", error);
        res.status(500).json({ message: "Server error processing trade." });
    }
};