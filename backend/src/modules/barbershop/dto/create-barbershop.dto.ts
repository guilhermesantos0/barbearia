import { IsString, IsOptional, IsArray, IsNumber, IsObject } from "class-validator";

export class CreateBarbershopDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsArray()
    workingHours?: {
        day: string;
        open?: string;
        close?: string;
        breaks?: { start: string; end: string }[];
    }[];

    @IsOptional()
    @IsArray()
    paymentMethods?: string[];

    @IsOptional()
    @IsObject()
    socialMedia?: Record<string, string>;

    @IsOptional()
    @IsString()
    cancellationPolicy?: string;

    @IsOptional()
    @IsNumber()
    delayTolerance?: number;

    @IsOptional()
    @IsString()
    emailDomain?: string

    @IsOptional()
    @IsArray()
    holidays?: string[];
}
