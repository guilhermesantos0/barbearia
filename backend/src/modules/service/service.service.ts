import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Service, ServiceDocument } from './schemas/service.schema';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ServiceService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
        private readonly logsService: LogsService
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

    async update(id: string, data: Partial<Service>, userId: string): Promise<Service | null> {
        const originalService = await this.serviceModel.findById(id).lean().exec();
        
        if (!originalService) {
            return null;
        }

        const updatedService = await this.serviceModel.findByIdAndUpdate(id, data, { new: true }).exec();

        if (updatedService) {
            const editedData: Partial<Service> = {};
            
            Object.keys(data).forEach(key => {
                if (data[key] !== originalService[key]) {
                    editedData[key] = { old: originalService[key], new: data[key] }
                }
            });

            if (Object.keys(editedData).length > 0) {
                await this.logsService.createLog({
                    userId: userId,
                    target: id,
                    targetType: 'Service',
                    action: 'SERVICE_UPDATE',
                    data: editedData
                });
            }
        }

        return updatedService;
    }

    async updateStatus(id: string, data: Partial<Service>, userId: string): Promise<Service | null> {
        await this.logsService.createLog({ 
            userId: userId,
            target: id,
            targetType: 'Service',
            action: 'SERVICE_UPDATE',
            data: {
                "active": {
                    "new": data.active,
                    "old": !data.active
                }
            }
        })

        return this.serviceModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Service | null> {
        return this.serviceModel.findByIdAndDelete(id).exec();
    }
}
