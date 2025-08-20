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
        trim: true,
        minLength: 2,
        maxlength: 100,
        index: true
    })
    name: string

    @Prop({
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    })
    description: string

    @Prop({
        required: true,
        min: 0
    })
    price: number

    @Prop({
        required: true,
        min: 1,
        max: 480
    })
    duration: number

    @Prop({
        type: String,
        enum: ['hair_services', 'beard_services', 'stetic_services', 'combo_services', 'other_services'],
        default: 'other_services',
        index: true
    })
    category: string;

    @Prop({
        type: Boolean,
        default: true,
        index: true
    })
    active: boolean;
}

export const ServiceSChema = SchemaFactory.createForClass(Service)