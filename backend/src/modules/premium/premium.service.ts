import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Premium, PremiumDocument } from './schemas/premium.schema';
import { Model } from 'mongoose';

@Injectable()
export class PremiumService {
    constructor(
        @InjectModel(Premium.name) private premiumModel: Model<PremiumDocument>
    ) {}

    async create(data: Partial<Premium>): Promise<Premium> {
        const newPremium = new this.premiumModel(data);
        return newPremium.save();
    }

    async findAll(): Promise<Premium[]> {
        return this.premiumModel.find().exec()
    }

    async findById(id: number): Promise<Premium | null> {
        return this.premiumModel.findById(id).exec();
    }

    async update(id: number, data: Partial<Premium>): Promise<Premium | null> {
        return this.premiumModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: number): Promise<Premium | null> {
        return this.premiumModel.findByIdAndDelete(id).exec();
    }
}
