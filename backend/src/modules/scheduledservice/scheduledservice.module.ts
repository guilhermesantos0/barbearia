import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduledServiceController } from './scheduledservice.controller';
import { ScheduledServiceService } from './scheduledservice.service';
import { ScheduledService, ScheduledServiceSchema } from './schemas/scheduledservice.schema';

@Module({
  imports: [
        MongooseModule.forFeature([{ name: ScheduledService.name, schema: ScheduledServiceSchema }])
  ],
  controllers: [ScheduledServiceController],
  providers: [ScheduledServiceService]
})
export class ScheduledserviceModule {}
