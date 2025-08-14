import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
    ValidateNested,
} from 'class-validator';

class BenefitDto {
    @IsOptional()
    @IsUUID()
    _id?: string;

    @IsNumber()
    position: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    key: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    label: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['percentage', 'fixed_value', 'free_service', 'free_courtesy', 'free_extra_service', 'other_plan_benefits', 'free_barbershop_products'], {
        message: 'type must be one of: percentage, fixed_value, free_service, free_courtesy, free_extra_service, other_plan_benefits, free_barbershop_products',
    })
    type: string;

    @IsBoolean()
    unlimited: boolean

    @IsOptional()
    @IsNumber()
    @IsPositive()
    value: number;

    @IsOptional()
    @IsObject()
    conditions?: Record<string, any>;
}

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsNumber()
    position: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsOptional()
    @IsBoolean()
    active?: boolean = true;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BenefitDto)
    benefits: BenefitDto[];
}
