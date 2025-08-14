import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PlanDocument = Plan & Document;

@Schema()
class Benefit {
    @Prop({ type: String, default: () => uuidv4() })
    _id?: string;

    @Prop({ default: 0 })
    position: number

    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    label: string;

    @Prop({ required: true })
    type: string; // 'percentage', 'fixed_value', 'free_service'...

    @Prop({ type: Boolean })
    unlimited: boolean

    @Prop()
    value?: number;

    @Prop({ type: Object })
    conditions?: object;
}


@Schema({ timestamps: true, versionKey: false })
export class Plan {
    @Prop({ type: String, default: () => uuidv4() })
    _id: string;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ default: 0 })
    position: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: [Benefit], default: [] })
    benefits: Benefit[];
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
