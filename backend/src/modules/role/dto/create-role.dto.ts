import {
    IsBoolean,
    IsDefined,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionDto {
    @IsBoolean()
    @IsDefined()
    create: boolean;

    @IsBoolean()
    @IsDefined()
    read: boolean;

    @IsBoolean()
    @IsDefined()
    update: boolean;

    @IsBoolean()
    @IsDefined()
    delete: boolean;
}

export class CreateRoleDto {
    @IsOptional()
    _id?: number;

    @IsString()
    @IsDefined()
    name: string;

    @IsObject()
    permissions: Record<string, PermissionDto>;
}
