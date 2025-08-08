import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ScheduledServiceDocument = ScheduledService & Document;

class Rate {
    @Prop({ required: false })
    stars: number;

    @Prop({ trim: true })
    comment: string;

    @Prop()
    ratedAt: Date;
}

@Schema({ timestamps: true, versionKey: false })
export class ScheduledService {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string;

    @Prop({ type: String, ref: 'User', required: true })
    costumer: string;

    @Prop({ type: String, ref: 'User', required: true })
    barber: string;

    @Prop({ type: String, ref: 'Service', required: true })
    service: string;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ default: 'Pendente' })
    status: string;

    @Prop()
    completedAt: Date;

    @Prop({ default: false })
    rated: boolean;

    @Prop({ type: Rate })
    rate: Rate;
}

export const ScheduledServiceSchema = SchemaFactory.createForClass(ScheduledService);
