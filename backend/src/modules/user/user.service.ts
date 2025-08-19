import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PasswordService } from 'src/common/services/password.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RoleService } from '../role/role.service';
import { ScheduledServiceService } from '../scheduledservice/scheduledservice.service';
import { ServiceService } from '../service/service.service';

import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Service } from '../service/schemas/service.schema';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('pt-br');

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private passwordService: PasswordService,
        private readonly subscriptionService: SubscriptionService,
        private readonly roleService: RoleService,
        private readonly scheduledServiceService: ScheduledServiceService,
        private readonly serviceService: ServiceService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await this.passwordService.hash(createUserDto.password!)
        const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id)
        .populate({
            path: 'history',
            populate: [
                {
                    path: 'costumer',
                },
                {
                    path: 'barber',
                    select: 'name profilePic'
                },
                {
                    path: 'service'
                }
            ]
        })
        .exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return user;
    }

    async getPlan(userId: string) {
        const plan = await this.subscriptionService.getActiveSubscriptionByUser(userId)
        return plan
    }

    async getHistory(userId: string) {
        return this.userModel
            .findById(userId)
            .select('history')
            .populate({
                path: 'history',
                match: { 
                    $and: [
                        { discountApplied: { $exists: true } },
                        { discountApplied: { $nin: [0, '0', null] } }
                    ]
                 },
                populate: [
                    { path: 'costumer' }, { path: 'barber' }, { path: 'service' }
                ]
            });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getBarbers(): Promise<User[] | null> {
        const barberRoles = await this.roleService.findBarberRoles();
        const barberUsers = await this.userModel.find({ role: { $in: barberRoles } }).exec();

        return barberUsers;
    }

    async getAvailableSlots(barberId: string, dateString: Date, serviceDuration: number) {
        const barber = await this.userModel.findById(barberId).exec();
        if(!barber?.work) return [];

        const _date = dayjs.utc(dateString).format('YYYY-MM-DD')
        const date = dayjs.tz(_date, 'YYYY-MM-DD', 'America/Sao_Paulo');

        const dayOfWeek = dayjs(date).tz('America/Sao_Paulo').format('dddd').toLowerCase();
        if(!barber.work.days.includes(dayOfWeek)) return[];

        const startOfDay = dayjs
            .tz(date, 'America/Sao_Paulo')
            .hour(Number(barber.work.time.start.split(':')[0]))
            .minute(Number(barber.work.time.start.split(':')[1]))

        const endOfDay = dayjs
            .tz(date, 'America/Sao_Paulo')
            .hour(Number(barber.work.time.end.split(':')[0]))
            .minute(Number(barber.work.time.end.split(':')[1]))

        const scheduled = await this.scheduledServiceService.findDateScheduled(barberId, startOfDay, endOfDay);

        let slots: string[] = [];
        let current = startOfDay;

        while ( current.add(serviceDuration, 'minute').isBefore(endOfDay) || current.add(serviceDuration, 'minute').isSame(endOfDay) ) {
            const slotStart = current;
            const slotEnd = current.add(serviceDuration, 'minute');

            const isInInterval = barber.work.time.intervals?.some(interval => {
                const intervalStart = dayjs(date)
                    .tz('America/Sao_Paulo')
                    .hour(Number(interval.start.split(':')[0]))
                    .minute(Number(interval.start.split(':')[1]))

                const intervalEnd = dayjs(date)
                    .tz('America/Sao_Paulo')
                    .hour(Number(interval.end.split(':')[0]))
                    .minute(Number(interval.end.split(':')[1]))

                return slotStart.isBefore(intervalEnd) && slotEnd.isAfter(intervalStart)
            })

            if(isInInterval) {
                current = current.add(serviceDuration, 'minute');
                continue;
            }

            const hasConflict = await Promise.all(
                scheduled.map(async app => {
                    const service = await this.serviceService.findById(app.service);
                    if (!service) return true

                    const appStart = dayjs(app.date);
                    const appEnd = appStart.add(service.duration, 'minute');

                    return slotStart.isBefore(appEnd) && slotEnd.isAfter(appStart);
                })
            ).then(conflicts => conflicts.some(Boolean));

            if (!hasConflict) {
                slots.push(slotStart.format('HH:mm'))
            }

            current = current.add(serviceDuration, 'minute');
        }

        return slots;
    } 

    async getBarberServices(barberId: string): Promise<any> {
        return this.userModel
            .findById(barberId)
            .populate({
                path: 'work.services',
                model: 'Service'
            })
            .select('work.schema')
            .exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        if (!updated) {
            throw new NotFoundException('Usuário não encontrado para atualização');
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.userModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException('Usuário não encontrado para remoção');
        }
    }

    async addScheduledService(userId: string, serviceId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, { $push: { history: serviceId }}, { new: true }).exec();
    }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }

    async fix(): Promise<string | null> {
        const result = await this.userModel.updateMany(
            {}, 
            { $unset: { premium: '', premiumTier: '' } },
            { strict: false }
        );
        return `${result.modifiedCount} usuários modificados`
    }
}
