import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type LogDocument = Log & Document;

@Schema({ versionKey: false })
export class Log {
    @Prop({ required: true, ref: 'User' })
    userId: string;

    @Prop({ required: true })
    target: string

    @Prop({ required: true })
    action: string;

    @Prop({ type: Object })
    data?: Record<string, any>;

    @Prop({ default: () => new Date() })
    timestamp: Date
}

export const LogSchema = SchemaFactory.createForClass(Log)