import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

class Interval {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    start: string;

    @Prop({ required: true })
    end: string;
}

class Time {
    @Prop({ required: true })
    start: string;

    @Prop({ required: true })
    end: string;

    @Prop({ type: [Object], default: [] })
    intervals: Interval[];
}

class Work {
    @Prop({ type: [String], default: [] })
    days: string[];

    @Prop({ type: Object })
    time: Time;

    @Prop({ type: [String], ref: 'Service', default: [] })
    services: string[];
}

class Premium {
    @Prop({ default: 0, ref: 'Premium' })
    tier: number;

    @Prop()
    acquiredAt?: Date;

    @Prop()
    expireAt?: Date;
}

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, unique: true, sparse: true })
    cpf: string;

    @Prop({ default: 'Prefiro não informar' })
    gender: string;

    @Prop()
    bornDate: Date;

    @Prop({ required: true })
    profilePic: string;

    @Prop({ type: Number, default: 0, ref: 'Role' })
    role: number;

    @Prop()
    premium?: Premium;

    @Prop({
        type: [{ type: String, ref: 'ScheduledService' }],
        default: []
    })
    history: string[];

    @Prop({ type: Object })
    work?: Work;
}

export const UserSchema = SchemaFactory.createForClass(User);
