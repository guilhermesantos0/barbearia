import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class IntervalDto {
    @IsString()
    name: string;

    @IsString()
    start: string;

    @IsString()
    end: string;
}

class TimeDto {
    @IsString()
    start: string;

    @IsString()
    end: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IntervalDto)
    intervals: IntervalDto[];
}

class WorkDto {
    @IsArray()
    @IsString({ each: true })
    days: string[];

    @ValidateNested()
    @Type(() => TimeDto)
    time: TimeDto;

    @IsArray()
    @IsString({ each: true })
    services: string[];
}

export class CreateEmployeeDto {
    @IsOptional()
    @IsUUID()
    _id?: string;

    @IsNumber()
    role: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    nextServices?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    lastServices?: string[];

    @ValidateNested()
    @Type(() => WorkDto)
    work: WorkDto;
}
