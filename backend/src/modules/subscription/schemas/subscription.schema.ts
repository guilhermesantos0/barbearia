import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Plan } from "src/modules/plan/schemas/plan.schema";
import { v4 as uuidv4 } from 'uuid';

export type SubscriptionDocument = Subscription & Document; 

@Schema({ versionKey: false })
export class Subscription {
    @Prop({ type: String, default: () => uuidv4()})
    _id: string;

    @Prop({ type: String, ref: 'User', required: true })
    userId: string;

    @Prop({ type: String, ref: 'Plan', required: true })
    planId: string | Plan;

    @Prop({ required: true })
    startDate: Date;

    @Prop()
    nextBillingDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ enum: ['active', 'paused', 'canceled'], default: 'active' })
    status: string;

    @Prop({ default: true })
    autoRenew: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);