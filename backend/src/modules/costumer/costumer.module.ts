import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CostumerController } from './costumer.controller';
import { CostumerService } from './costumer.service';
import { Costumer, CostumerSchema } from './schemas/costumer.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Costumer.name, schema: CostumerSchema }])
    ],
    controllers: [CostumerController],
    providers: [CostumerService],
})
export class CostumerModule {}
