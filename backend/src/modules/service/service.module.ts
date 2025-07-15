import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

import { Service, ServiceSChema } from './schemas/service.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Service.name, schema: ServiceSChema }])
    ],
    controllers: [ServiceController],
    providers: [ServiceService],
})
export class ServiceModule {}
