import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Plan, PlanSchema } from './schemas/plan.schema';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

import { CounterModule } from '../counter/counter.module';
import { CounterService } from '../counter/counter.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
        CounterModule,

    ],
    providers: [PlanService],
    controllers: [PlanController],
})
export class PlanModule {}
