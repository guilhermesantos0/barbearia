import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsNumber()
    _id: number;

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsArray()
    permissions: string[]
}