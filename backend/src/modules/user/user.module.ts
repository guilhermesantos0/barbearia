import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

import { CommonModule } from 'src/common/common.module';

import { AuthModule } from '../auth/auth.module';
import { PremiumModule } from '../premium/premium.module';
import { Premium, PremiumSchema } from '../premium/schemas/premium.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Premium.name, schema: PremiumSchema }]),
        CommonModule,
        forwardRef(() => AuthModule),
        PremiumModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}