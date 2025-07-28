import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { Costumer, CostumerSchema } from '../costumer/schemas/costumer.schema';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

import { CommonModule } from 'src/common/common.module';
import { JwtStrategy } from './jwt.strategy';

import { EmployeeModule } from '../employee/employee.module';
import { CostumerModule } from '../costumer/costumer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Costumer.name, schema: CostumerSchema },
            { name: Employee.name, schema: EmployeeSchema },
        ]),
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'GuilhermeSantosProgramacao2025',
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d'
                }
            })
        }),
        CommonModule,
        EmployeeModule,
        forwardRef(() => CostumerModule),
        
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
