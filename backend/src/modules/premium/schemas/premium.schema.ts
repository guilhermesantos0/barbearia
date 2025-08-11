import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PremiumDocument = Premium & Document;

@Schema({ timestamps: true, versionKey: false })
export class Premium {
    @Prop({ type: Number, unique: true })
    _id: number;

    @Prop({ unique: true, required: true })
    position: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [Object], default: [] })
    benefits: { pos: number; description: string }[];
}

export const PremiumSchema = SchemaFactory.createForClass(Premium);
