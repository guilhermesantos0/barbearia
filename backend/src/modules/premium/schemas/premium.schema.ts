import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PremiumDocument = Plan & Document;

@Schema({ timestamps: true, versionKey: false })
class Plan {
    @Prop({ type: String, default: () => uuidv4() })
    _id: string;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number; // preço base

    @Prop({ default: 'BRL' })
    currency: string;

    @Prop({ enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' })
    billingCycle: string;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: [Benefit], default: [] }) // benefícios diretos do plano
    benefits: Benefit[];
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
