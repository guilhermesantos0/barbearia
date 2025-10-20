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
    @IsString()
    openTime?: string;

    @IsOptional()
    @IsString()
    closeTime?: string;

    @IsOptional()
    @IsArray()
    openDays?: string[];

    @IsOptional()
    @IsArray()
    breaks?: { start: string; end: string }[];

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
