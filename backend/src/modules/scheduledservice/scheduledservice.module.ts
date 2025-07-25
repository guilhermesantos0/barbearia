import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduledServiceController } from './scheduledservice.controller';
import { ScheduledServiceService } from './scheduledservice.service';
import { ScheduledService, ScheduledServiceSchema } from './schemas/scheduledservice.schema';
import { CostumerModule } from '../costumer/costumer.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
        MongooseModule.forFeature([{ name: ScheduledService.name, schema: ScheduledServiceSchema }]),
        CostumerModule,
        EmployeeModule
  ],
  controllers: [ScheduledServiceController],
  providers: [ScheduledServiceService]
})
export class ScheduledserviceModule {}
