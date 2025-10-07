import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduledServiceController } from './scheduledservice.controller';
import { ScheduledServiceService } from './scheduledservice.service';
import { ScheduledService, ScheduledServiceSchema } from './schemas/scheduledservice.schema';
import { UserModule } from '../user/user.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ScheduledService.name, schema: ScheduledServiceSchema }]),
    UserModule,
    LogsModule
  ],
  controllers: [ScheduledServiceController],
  providers: [ScheduledServiceService],
  exports: [ScheduledServiceService]
})
export class ScheduledserviceModule {}
