import mongoose, {Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    walletBalance: number;
    portfolio: any[]; 
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0},
    portfolio: [
        {
            symbol: { type: String, required: true},
            quantity: { type: Number, required: true},
            avgPrice: {type: Number, required: true},
        },
    ]
}, {timestamps: true});


export default mongoose.model<IUser>('User',UserSchema);