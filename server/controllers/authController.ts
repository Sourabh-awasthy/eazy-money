import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(400).json({ message: "User already exists !"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id}, JWT_SECRET, {expiresIn: '15d'});
        res.status(201).json({token, user: {email: user.email}});
    }
    catch (error){
        res.status(500).json({message:"server error", error});
    }
};

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if(!existingUser){
            res.status(400).json({message:"Invalid Credentials"});
            return;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            res.status(400).json({message:"Invalid Credentials"});
            return;
        }

        const token = jwt.sign({ userId: existingUser._id}, JWT_SECRET, {expiresIn: '15d'});
        res.status(200).json({token, user: {email: existingUser.email, walletBalance: existingUser.walletBalance}});
    }
    catch (error) {
        res.status(500).json({message: "Server error",error});
    }
};
