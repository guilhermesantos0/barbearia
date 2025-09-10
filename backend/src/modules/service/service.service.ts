import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServiceService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>
    ) {}

    async create(data: Partial<Service>): Promise<Service> {
        const newService = new this.serviceModel(data);
        return newService.save();
    }

    async findAll(): Promise<Service[]> {
        return this.serviceModel.find().exec();
    }

    async findById(id: string): Promise<Service | null> {
        return this.serviceModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Service>): Promise<Service | null> {
        return this.serviceModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async updateStatus(id: string, data: Partial<Service>): Promise<Service | null> {
        return this.serviceModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Service | null> {
        return this.serviceModel.findByIdAndDelete(id).exec();
    }
}
