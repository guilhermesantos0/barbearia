import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SubscriptionDocument = Subscription & Document; 

@Schema()
export class Subscription {
    @Prop({ type: String, ref: 'User', required: true })
    userId: string;

    @Prop({ type: String, ref: 'Plan', required: true })
    planId: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ enum: ['active', 'paused', 'canceled'], default: 'active' })
    status: string;

    @Prop({ default: true })
    autoRenew: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);