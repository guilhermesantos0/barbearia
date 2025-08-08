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

    async reset(id: string): Promise<string> {
        await this.counterModel.findOneAndUpdate(
            { _id: 'Role' },
            { $set: { sequence_value: 0 } },
            { upsert: true }
        );

        return 'Sucesso';
    }
}
