import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, versionKey: false })
export class Service {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string;

    @Prop({
        required: true,
        trim: true
    })
    name: string

    @Prop({
        required: true,
        trim: true
    })
    description: string

    @Prop({
        required: true
    })
    price: number

    @Prop({
        required: true
    })
    duration: number
}

export const ServiceSChema = SchemaFactory.createForClass(Service)