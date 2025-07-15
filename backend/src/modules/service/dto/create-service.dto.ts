import { IsNotEmpty, IsNumber, IsString, isNumber, isString } from "class-validator";

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
}