import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCostumerDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    role: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    profilePic?: string;

    @IsOptional()
    @IsNumber()
    premiumTier?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    history?: string[];
}
