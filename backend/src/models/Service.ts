import { Document, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IService extends Document {
    _id: String,
    name: string,
    description: string,
    price: number,
    duration: number
}

const serviceSchema = new Schema<IService>({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    name: {
        type: String,
        required: true,
        unique: true,
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
    duration: {
        type: Number,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false

});


const Service = model<IService>('Service', serviceSchema);
export default Service;