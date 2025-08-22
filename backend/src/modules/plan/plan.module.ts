import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Plan, PlanSchema } from './schemas/plan.schema';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    ],
    providers: [PlanService],
    controllers: [PlanController],
    exports: [PlanService]
})
export class PlanModule {}
