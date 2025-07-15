import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class BenefitDto {
    @IsNumber()
    pos: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CreatePremiumDto {
    @IsNotEmpty()
    @IsNumber()
    position: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => BenefitDto)
    benefits: BenefitDto[];

}