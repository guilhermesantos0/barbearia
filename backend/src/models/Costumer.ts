import { Document, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICostumer extends Document {
    _id: string;
    name: string;
    email: string;
    password?: string;
    phone: string;
    cpf?: string;
    profilePic?: string;
    premiumTier?: number;
    history?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const costumerSchema = new Schema<ICostumer>(
    {
        _id: {
            type: String,
            default: () => uuidv4(),
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        cpf: {
            type: String,
            unique: true,
            sparse: true,
        },
        profilePic: {
            type: String,
            default: '',
        },
        premiumTier: {
            type: Number,
            default: 0,
            ref: 'Premium',
        },
        history: [
            {
                type: String,
                ref: 'ScheduledService',
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Costumer = model<ICostumer>('Costumer', costumerSchema);
export default Costumer;
