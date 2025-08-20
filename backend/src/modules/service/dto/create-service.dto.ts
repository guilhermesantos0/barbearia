import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, isNumber, isString } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNumber()
    price: number

    @IsNumber()
    duration: number

    @IsString()
    @IsEnum(['hair_services', 'beard_services', 'stetic_services', 'combo_services', 'other_services'])
    category: string

    @IsBoolean()
    active: boolean
}