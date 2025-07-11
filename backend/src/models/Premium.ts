import { Document, Schema, model } from 'mongoose';
import { getNextSequence } from '../middlewares/getNextSequence';

interface IBenefit {
    pos: number,
    description: string
}

export interface IPremium extends Document {
    _id: number,
    position: number,
    name: string,
    description: string,
    price: number,
    benefits: IBenefit[]
}

const premiumSchema = new Schema<IPremium>({
    _id: { 
        type: Number, 
        unique: true 
    },
    position: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    benefits: [
        {
            pos: {
                type: Number,
                required: true,
                unique: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ]
})

premiumSchema.pre<IPremium>('save', async function (next){
    if (!this.isNew || this._id) return next();


    const nextId = await getNextSequence('premium');
    this.id = nextId;
    next();
})

const Premium = model<IPremium>('Premium', premiumSchema);
export default Premium;