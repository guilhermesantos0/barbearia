import { Document, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ICostumer } from './Costumer';
import { IEmployee } from './Employee';
import { IService } from './Service';

interface IRate {
    stars: number;
    comment: string;
    ratedAt: string
}

export interface IScheduledService extends Document {
    _id: string;
    costumer: ICostumer;
    barber: IEmployee;
    service: IService;
    date: Date;
    complete: boolean;
    completedAt: Date;
    rated: boolean;
    rate: IRate
}

const scheduledServiceSchema = new Schema<IScheduledService>({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    costumer: {
        type: String,
        ref: 'Costumer',
        required: true
    },
    barber: {
        type: String,
        ref: 'Employee',
        required: true
    },
    service: {
        type: Number,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    rated: {
        type: Boolean,
        deafult: false
    },
    rate: {
        stars: Number,
        comment: { type: String, trim: true },
        ratedAt: Date
    }
},
{
    timestamps: true,
    versionKey: false

})


const ScheduledService = model<IScheduledService>('ScheduledService', scheduledServiceSchema);
export default ScheduledService;