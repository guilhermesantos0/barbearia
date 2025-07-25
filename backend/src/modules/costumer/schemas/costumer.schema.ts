import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CostumerDocument = Costumer & Document;

@Schema({ timestamps: true, versionKey: false })
export class Costumer {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: 0 })
    role: number;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, unique: true })
    phone: string;

    @Prop({ unique: true, sparse: true })
    cpf: string;

    @Prop({ default: false })
    profilePic: boolean;

    @Prop({ default: 0, ref: 'Premium' })
    premiumTier: number;

    @Prop({
        type: [{ type: String, ref: 'ScheduledService' }],
        default: []
    })
    history: string[];
}

export const CostumerSchema = SchemaFactory.createForClass(Costumer);