import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Permission {
    @Prop({ required: true })
    create: boolean;

    @Prop({ required: true })
    read: boolean;

    @Prop({ required: true })
    update: boolean;

    @Prop({ required: true })
    delete: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

@Schema({ timestamps: true, versionKey: false })
export class Role {
    @Prop({ type: Number, unique: true })
    _id: number;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ default: false })
    isBarber: boolean;

    @Prop({
        type: Object,
        required: true,
        default: {},
    })
    permissions: Record<string, Permission>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
