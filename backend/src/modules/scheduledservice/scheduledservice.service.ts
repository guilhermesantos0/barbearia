import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ScheduledService,
    ScheduledServiceDocument
} from './schemas/scheduledservice.schema';

import { CreateScheduledServiceDto } from './dto/create-scheduledservice.dto';

@Injectable()
export class ScheduledServiceService {
    constructor(
        @InjectModel(ScheduledService.name) private readonly scheduledServiceModel: Model<ScheduledServiceDocument>
    ) {}

    async create(data: CreateScheduledServiceDto): Promise<ScheduledService> {
        const newService = new this.scheduledServiceModel(data);
        return newService.save();
    }

    async findAll(): Promise<ScheduledService[]> {
        return this.scheduledServiceModel.find().populate('costumer').populate('barber').populate('service').exec();
    }

    async findById(id: string): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findById(id).populate('costumer').populate('barber').populate('service').exec();
    }

    async update(id: string, data: Partial<ScheduledService>): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async updatePatch(id: string, data: Partial<ScheduledService>): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id: string): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findByIdAndDelete(id).exec();
    }
}
