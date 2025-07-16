import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CostumerModule } from './modules/costumer/costumer.module';
import { ServiceModule } from './modules/service/service.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { RoleModule } from './modules/role/role.module';
import { ScheduledserviceModule } from './modules/scheduledservice/scheduledservice.module';
import { PremiumModule } from './modules/premium/premium.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
            inject: [ConfigService]
        }),
        CostumerModule,
        ServiceModule,
        EmployeeModule,
        RoleModule,
        ScheduledserviceModule,
        PremiumModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
