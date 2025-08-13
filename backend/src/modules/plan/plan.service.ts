import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Plan, PlanDocument } from './schemas/plan.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlanService {
    constructor(
        @InjectModel(Plan.name) private planModel: Model<PlanDocument>
    ) {}

    async create(data: Partial<Plan>): Promise<Plan> {
        const newPlan = new this.planModel(data);
        return newPlan.save();
    }

    async findAll(): Promise<Plan[]> {
        return this.planModel.find().exec()
    }

    async findById(id: number): Promise<Plan | null> {
        return this.planModel.findById(id).exec();
    }

    async update(id: number, data: Partial<Plan>): Promise<Plan | null> {
        return this.planModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: number): Promise<Plan | null> {
        return this.planModel.findByIdAndDelete(id).exec();
    }

    async reset() {
        
    }
}
