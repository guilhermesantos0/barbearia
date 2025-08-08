import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CostumerController } from './costumer.controller';
import { CostumerService } from './costumer.service';
import { Costumer, CostumerSchema } from './schemas/costumer.schema';

import { CommonModule } from 'src/common/common.module';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Costumer.name, schema: CostumerSchema }]),
        CommonModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [CostumerController],
    providers: [CostumerService],
    exports: [CostumerService]
})
export class CostumerModule {}
