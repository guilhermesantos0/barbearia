import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsDate, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    phone: string;

    @IsString()
    cpf: string;

    @IsString()
    gender: string;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    bornDate?: Date;

    @IsString()
    profilePic: string;

    @IsNumber()
    role: number;

    @IsOptional()
    premium?: any;

    @IsOptional()
    @IsArray()
    history?: string[];

    @IsOptional()
    work?: any;
}
