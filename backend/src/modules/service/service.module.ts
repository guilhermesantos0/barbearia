import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

import { Service, ServiceSChema } from './schemas/service.schema';
import { LogsModule } from '../logs/logs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Service.name, schema: ServiceSChema }]),
        LogsModule
    ],
    controllers: [ServiceController],
    providers: [ServiceService],
    exports: [ServiceService]
})
export class ServiceModule {}
