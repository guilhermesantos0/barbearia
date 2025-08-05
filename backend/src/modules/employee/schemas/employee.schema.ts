import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type EmployeeDocument = Employee & Document;

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

@Schema({ timestamps: true, versionKey: false })
export class Employee {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string;

    @Prop({ type: Number, required: true, ref: 'Role' })
    role: number;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: '.' })
    profilePic: string;

    @Prop({ required: true, unique: true })
    phone: string;

    @Prop({ required: true, unique: true, sparse: true })
    cpf: string;

    @Prop({ default: 'Prefiro não informar' })
    gender: string;

    @Prop()
    bornDate: Date;

    @Prop({ type: [String], ref: 'ScheduledService', default: [] })
    nextServices: string[];

    @Prop({ type: [String], ref: 'ScheduledService', default: [] })
    lastServices: string[];

    @Prop({ type: Object })
    work: Work;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
