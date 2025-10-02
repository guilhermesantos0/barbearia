import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schemas/logs.schema';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])
    ],
    controllers: [LogsController],
    providers: [LogsService],
    exports: [LogsService]
})
export class LogsModule {}
