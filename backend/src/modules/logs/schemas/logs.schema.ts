import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TargetType } from "./target-type.enum";
import { v4 as uuidv4 } from 'uuid';

export type LogDocument = Log & Document;

@Schema({ versionKey: false })
export class Log {
    @Prop({
        type: String,
        default: () => uuidv4()
    })
    _id: string;

    @Prop({ required: true, ref: 'User' })
    userId: string;

    @Prop({ required: true })
    target: string

    @Prop({ required: true, enum: TargetType })
    targetType: string;

    @Prop({ required: true })
    action: string;

    @Prop({ type: Object })
    data?: Record<string, any>;

    @Prop({ default: () => new Date() })
    timestamp: Date
}

export const LogSchema = SchemaFactory.createForClass(Log)