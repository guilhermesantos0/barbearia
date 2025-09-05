import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ScheduledService,
    ScheduledServiceDocument
} from './schemas/scheduledservice.schema';

import { CreateScheduledServiceDto } from './dto/create-scheduledservice.dto';
import { Dayjs } from 'dayjs';

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

    async findDateScheduled(barberId: string, startOfDay: Dayjs, endOfDay: Dayjs) {

        const scheduled = await this.scheduledServiceModel.find({ 
            barber: barberId,
            date: { $gte: startOfDay.toDate(), $lt: endOfDay.toDate() },
            status: { $ne: 'Cancelado' }
        }).exec();

        return scheduled;
    }

    async findUnconfirmedByBarber(barberId: string): Promise<ScheduledService[]> {
        return this.scheduledServiceModel.find({ 
            barber: barberId,
            status: 'Pendente'
        }).populate('costumer').populate('barber').populate('service').exec();
    }

    async findNextByUser(userId: string, fromDate: Date): Promise<ScheduledService[]> {
        const day = fromDate.getDay();

        const startOfWeek = new Date(fromDate);
        const diffToMonday = (day === 0 ? -6 : 1) - day;
        startOfWeek.setDate(fromDate.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const services = await this.scheduledServiceModel.find({ 
            barber: userId,
            date: { $gte: startOfWeek, $lte: endOfWeek },
            status: { $nin: ['Pendente', 'Cancelado'] }
        }).populate('costumer').populate('barber').populate('service').exec();

        return services;
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
