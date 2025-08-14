import { IsUUID, IsDateString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateSubscriptionDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    planId: string;

    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @IsOptional()
    @IsEnum(['active', 'paused', 'canceled'])
    status?: 'active' | 'paused' | 'canceled';

    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;
}
