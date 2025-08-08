import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './schemas/counter.schema';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])],
    controllers: [CounterController],
    providers: [CounterService],
    exports: [CounterService],
})
export class CounterModule {}
