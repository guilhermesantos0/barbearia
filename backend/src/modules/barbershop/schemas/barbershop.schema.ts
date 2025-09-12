import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

export type BarberShopDocument = BarberShop & Document;

@Schema({ versionKey: false })
export class BarberShop {
    @Prop({
        type: String,
        default: () => uuidv4(),
    })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop()
    phone?: string;

    @Prop()
    email?: string;

    @Prop()
    logoUrl?: string;

    @Prop({
        type: [
            {
                day: { type: String, required: true },
                open: { type: String },
                close: { type: String },
                breaks: [
                    {
                        start: { type: String },
                        end: { type: String },
                    },
                ],
            },
        ],
        default: [],
    })
    workingHours: {
        day: string;
        open?: string;
        close?: string;
        breaks?: { start: string; end: string }[];
    }[];

    @Prop({
        type: [String],
        default: [],
    })
    paymentMethods: string[];

    @Prop({
        type: Map,
        of: String,
        default: {},
    })
    socialMedia: Record<string, string>;

    @Prop()
    cancellationPolicy?: string;

    @Prop()
    delayTolerance: number;

    @Prop()
    emailDomain?: string
}

export const BarberShopSchema = SchemaFactory.createForClass(BarberShop);
