import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ArrayNotEmpty, IsBoolean } from 'class-validator';

export class CreateCostumerDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    role: number;

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
    @IsBoolean()
    profilePic?: boolean;

    @IsOptional()
    @IsNumber()
    premiumTier?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    history?: string[];
}
