import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ScheduledService,
    ScheduledServiceDocument
} from './schemas/scheduledservice.schema';

import { CreateScheduledServiceDto } from './dto/create-scheduledservice.dto';
import { Dayjs } from 'dayjs';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ScheduledServiceService {
    constructor(
        @InjectModel(ScheduledService.name) private readonly scheduledServiceModel: Model<ScheduledServiceDocument>,
        private readonly logsService: LogsService
    ) {}

    async create(data: CreateScheduledServiceDto): Promise<ScheduledService> {
        const newService = new this.scheduledServiceModel(data);
        return newService.save();
    }

    async findAll(full: boolean = false): Promise<ScheduledService[]> {
        if (full) return this.scheduledServiceModel.find().populate('costumer').populate('barber').populate('service').exec();

        return this.scheduledServiceModel.find().exec();
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

    async update(id: string, data: Partial<ScheduledService>, userId: string): Promise<ScheduledService | null> {
        const originalAppointment = await this.scheduledServiceModel.findById(id).lean().exec();

        if (!originalAppointment) {
            return null;
        }

        const updatedAppointment = await this.scheduledServiceModel.findByIdAndUpdate(id, data, { new: true }).exec();

        if (updatedAppointment) {
            const editedData: Partial<ScheduledService> = {};

            Object.keys(data).forEach(key => {
                if (data[key] !== originalAppointment[key]) {
                    editedData[key] = { old: originalAppointment[key], new: data[key] }
                }
            });

            if (Object.keys(editedData).length > 0) {
                await this.logsService.createLog({
                    userId: userId,
                    target: id,
                    targetType: 'ScheduledService',
                    action: 'SCHEDULED_SERVICE_UPDATE',
                    data: editedData
                })
            }
        }

        return updatedAppointment;
    }

    async updatePatch(id: string, data: Partial<ScheduledService>): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id: string): Promise<ScheduledService | null> {
        return this.scheduledServiceModel.findByIdAndDelete(id).exec();
    }
}
