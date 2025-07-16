import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Costumer, CostumerDocument } from './schemas/costumer.schema';
import { PasswordService } from 'src/common/services/password.service';

@Injectable()
export class CostumerService {
    constructor(
        @InjectModel(Costumer.name) 
        private costumerModel: Model<CostumerDocument>,
        private passwordService: PasswordService
    ) {}

    async create(data: Partial<Costumer>): Promise<Costumer> {
        const hashedPassword = await this.passwordService.hash(data.password!)
        const newCostumer = new this.costumerModel({
            ...data,
            password: hashedPassword
        });
        return newCostumer.save();
    }

    async findAll(): Promise<Costumer[]> {
        return this.costumerModel.find().exec();
    }

    async findById(id: string): Promise<Costumer | null> {
        return this.costumerModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<Costumer | null> {
        return this.costumerModel.findOne({ email: email }).lean().exec();
    }

    async update(id: string, data: Partial<Costumer>): Promise<Costumer | null> {
        return this.costumerModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Costumer | null> {
        return this.costumerModel.findByIdAndDelete(id).exec();
    }
}