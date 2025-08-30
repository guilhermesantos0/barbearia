import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class RateDto {
    @IsNumber()
    @IsOptional()
    stars?: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsDateString()
    @IsOptional()
    ratedAt?: string;
}

export class CreateScheduledServiceDto {
    @IsString()
    @IsNotEmpty()
    costumer: string;

    @IsString()
    @IsNotEmpty()
    barber: string;

    @IsString()
    @IsNotEmpty()
    service: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsDateString()
    @IsOptional()
    completedAt?: string;

    @IsNumber()
    @IsOptional()
    discountApplied?: number;

    @IsBoolean()
    @IsOptional()
    rated?: boolean;

    @ValidateNested()
    @Type(() => RateDto)
    @IsOptional()
    rate?: RateDto;

    @IsString()
    @IsOptional()
    cancelReason?: string;
}
