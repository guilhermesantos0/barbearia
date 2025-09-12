import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceModule } from './modules/service/service.module';
import { RoleModule } from './modules/role/role.module';
import { ScheduledserviceModule } from './modules/scheduledservice/scheduledservice.module';
import { PlanModule } from './modules/plan/plan.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LogsModule } from './modules/logs/logs.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { BarbershopModule } from './modules/barbershop/barbershop.module';

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
        ServiceModule,
        RoleModule,
        ScheduledserviceModule,
        PlanModule,
        AuthModule,
        UserModule,
        LogsModule,
        SubscriptionModule,
        BarbershopModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
