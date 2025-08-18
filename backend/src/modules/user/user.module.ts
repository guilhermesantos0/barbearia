import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

import { CommonModule } from 'src/common/common.module';

import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { RoleModule } from '../role/role.module';
import { ScheduledserviceModule } from '../scheduledservice/scheduledservice.module';
import { ServiceModule } from '../service/service.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CommonModule,
        forwardRef(() => AuthModule),
        SubscriptionModule,
        RoleModule,
        forwardRef(() => ScheduledserviceModule),
        ServiceModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}