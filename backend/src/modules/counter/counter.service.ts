import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from './schemas/counter.schema';

@Injectable()
export class CounterService {
    constructor(
        @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    ) {}

    async getNextSequence(sequenceName: string): Promise<number> {
        const updated = await this.counterModel.findByIdAndUpdate(
            sequenceName,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return updated.seq;
    }

    async reset(sequenceName: string, value: number = 0): Promise<number> {

        const updated = await this.counterModel.findByIdAndUpdate(
            sequenceName,
            { $set: { seq: value } },
            { new: true, upsert: true }
        );

        return updated.seq;
    }
}
