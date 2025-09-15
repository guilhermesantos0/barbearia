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
import { Service, ServiceDocument } from '../service/schemas/service.schema';
import { PlanService } from '../plan/plan.service';
import { Benefit } from '../plan/schemas/plan.schema';
import { isIn } from 'class-validator';
import { ScheduledServiceDocument } from '../scheduledservice/schemas/scheduledservice.schema';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('pt-br');

type Period = "week" | "month" | "year";
const TZ = "America/Sao_Paulo";

type PopulatedScheduleService = Omit<ScheduledServiceDocument, 'costumer' | 'barber' | 'service'> & {
    costumer: UserDocument,
    barber: UserDocument,
    service: ServiceDocument,
}
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private passwordService: PasswordService,
        private readonly subscriptionService: SubscriptionService,
        private readonly roleService: RoleService,
        private readonly scheduledServiceService: ScheduledServiceService,
        private readonly serviceService: ServiceService,
        private readonly planService: PlanService
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

    async findRawById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
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

    async getDiscountHistory(userId: string, full: boolean = false) {
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

    async getHistory(userId: string) {
        return this.userModel
            .findById(userId)
            .select('history')
            .populate({
                path: 'history',
                populate: [
                    { path: 'costumer' }, { path: 'barber' }, { path: 'service' }
                ]
            });
    }

    async getNextServices(userId: string) {
        const now = new Date();
        return this.scheduledServiceService.findNextByUser(userId, now);
    }

    async getWorkTimes(userId: string): Promise<string[]> {
        const user = await this.userModel.findById(userId).exec();

        if(!user || !user.work) {
            throw new NotFoundException('Usuário não encontrado ou não possui agenda configurada')
        }

        const currentDate = dayjs().tz('America/Sao_Paulo');

        const startOfDay = dayjs
            .tz(currentDate, 'America/Sao_Paulo')
            .hour(Number(user.work.time.start.split(':')[0]))
            .minute(Number(user.work.time.start.split(':')[1]))

        const endOfDay = dayjs
            .tz(currentDate, 'America/Sao_Paulo')
            .hour(Number(user.work.time.end.split(':')[0]))
            .minute(Number(user.work.time.end.split(':')[1]))

        let slots: string[] = [];
        let current = startOfDay;

        while ( current.add(30, 'minute').isBefore(endOfDay) || current.add(30, 'minute').isSame(endOfDay) ) {
            const slotStart = current;
            const slotEnd = current.add(30, 'minute');

            const isInInterval = user.work.time.intervals?.some(interval => {
                const intervalStart = dayjs(currentDate)
                    .tz('America/Sao_Paulo')
                    .hour(Number(interval.start.split(':')[0]))
                    .minute(Number(interval.start.split(':')[1]))

                const intervalEnd = dayjs(currentDate)
                    .tz('America/Sao_Paulo')
                    .hour(Number(interval.end.split(':')[0]))
                    .minute(Number(interval.end.split(':')[1]))

                return slotStart.isBefore(intervalEnd) && slotEnd.isAfter(intervalStart)
            })

            if (!isInInterval) {    
                slots.push(slotStart.format('HH:mm'))
            }
            current = current.add(30, 'minute');
        }

        return slots;
    }

    async getWorkingDays(userId: string): Promise<string[]> {

        const user = await this.userModel.findById(userId).exec();
        if(!user || !user.work) {
            throw new NotFoundException('Usuário não encontrado ou não possui agenda configurada')
        }
        
        const labels = {
            'segunda-feira': 'Seg',
            'terça-feira': 'Ter',
            'quarta-feira': 'Qua',
            'quinta-feira': 'Qui',
            'sexta-feira': 'Sex',
            'sábado': 'Sáb',
            'domingo': 'Dom',
        };

        return user.work.days.map(day => labels[day]);
    }

    async addInterval(userId: string, interval: any): Promise<User> {
        const newInterval = await this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { 'work.time.intervals': interval } },
        ).exec();
        if(!newInterval || !newInterval.work) {
            throw new NotFoundException('Usuário não encontrado ou não possui agenda configurada')
        }

        return newInterval;
    }

    async getStats(userId: string, type: Period): Promise<Object> {

        function getPeriodStart(filter: Period) {
            return dayjs().tz(TZ).startOf(filter);
        }

        function isInPeriod(dateISO: string | Date, filter: Period) {
            const start = getPeriodStart(filter);
            return dayjs(dateISO).tz(TZ).isSame(start) || dayjs(dateISO).tz(TZ).isAfter(start);
        }

        const currentDate = dayjs().tz(TZ);
        const periodStart = currentDate.startOf(type);

        const userData = await this.userModel
            .findById(userId)
            .populate({
                path: 'history',
                populate: [ { path: 'service' }, { path: 'costumer' } ]
            }) as unknown as {
                history: PopulatedScheduleService[]
            };

        const returnUserData = await this.userModel.findById(userId).exec();

        if(!userData) {
            throw new NotFoundException('Usuário não encontrado')
        }

        const servicesInPeriod = userData?.history.filter((service) => {
            const when = dayjs(service.date).tz(TZ);
            return service.status === 'Finalizado' && (when.isSame(periodStart) || when.isAfter(periodStart));
        });
        const generatedIncome = servicesInPeriod.reduce((acc, service) => { return acc + service.service.price }, 0);
        
        const groupAppointments = (filter: 'week' | 'month' | 'year') => {
            const startDate = currentDate.startOf(filter);

            const filteredAppointments = userData.history.filter((service) => {
                const when = dayjs(service.date).tz(TZ);
                return service.status === 'Finalizado' && (when.isSame(startDate) || when.isAfter(startDate));
            });

            const groupedPerDay = filteredAppointments.reduce((acc: Record<number, number>, service) => {
                const dayOfWeek = dayjs(service.date).tz(TZ).day();
                acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
                return acc;
            }, {});

            const groupedPerService = filteredAppointments.reduce((acc: Record<string, number>, service) => {
                const serviceName = service.service.name;
                acc[serviceName] = (acc[serviceName] || 0) + 1
                return acc
            }, {})

            const groupedPerRate = filteredAppointments.reduce((acc: Record<number, number>, service) => {
                if (!service.rate?.stars) return acc
                const rateStars = service.rate?.stars;
                acc[rateStars] = (acc[rateStars] || 0) + 1;
                return acc;
            }, {})

            return { groupedPerDay, groupedPerService, groupedPerRate };
        }

        const getUniqueCustomersCount = (filter: Period): number => {
            const set = new Set<string>();

            userData.history.forEach(service => {
                if (service.status === 'Finalizado' && isInPeriod(service.date, filter)) {
                    set.add(service.costumer._id)
                }
            })

            return set.size;
        }

        const getNewvsReturning = (filter: Period): { newClients: number, returningClients: number } => {
            const start = getPeriodStart(filter);
            const firstSeenByClient = new Map<string, dayjs.Dayjs>();

            userData.history
                .filter(service => service.status === 'Finalizado')
                .forEach(service => {
                    const date = dayjs(service.date).tz(TZ);
                    const prev = firstSeenByClient.get(service.costumer._id);
                    if (!prev || date.isBefore(prev)) {
                        firstSeenByClient.set(service.costumer._id, date);
                    }
                })
                
            const clientsThisPeriod = new Set<string>();
            userData.history
                .filter(service => service.status === "Finalizado" && (when => when.isSame(start) || when.isAfter(start))(dayjs(service.date).tz(TZ)))
                .forEach(service => clientsThisPeriod.add(service.costumer._id));

            let newClients = 0, returningClients = 0;
            clientsThisPeriod.forEach(clientId => {
                const firstSeen = firstSeenByClient.get(clientId);
                if (firstSeen && (firstSeen.isSame(start) || firstSeen.isAfter(start))) {
                    newClients++;
                } else {
                    returningClients++;
                }
            });

            return { newClients, returningClients };
        }

        const getHighestPeriods = (): { morning: number, afternoon: number, night: number }  => {
            let morning = 0, afternoon = 0, night = 0;

            userData.history.forEach(service => {
                if( service.status !== 'Finalizado' || !isInPeriod(service.date, type)) return;

                const hour = dayjs(service.date).tz(TZ).hour();
                if (hour >= 6 && hour <= 11) morning++;
                else if (hour >= 12 && hour <= 17) afternoon++;
                else if (hour >= 18 && hour <= 23) night++;
            })

            return { morning, afternoon, night }
        }

        const getAverageRatingByService = (): Record<string, number> => {
            const ratings: Record<string, { total: number; count: number }> = {};

            userData.history.forEach(service => {
                if (service.status !== 'Finalizado' || !service.rate?.stars) return;

                const name = service.service.name;

                if (!ratings[name]) {
                    ratings[name] = { total: 0, count: 0 };
                }

                ratings[name].total += service.rate.stars;
                ratings[name].count++;
            });

            const result: Record<string, number> = {};
            Object.keys(ratings).forEach(name => {
                result[name] = parseFloat((ratings[name].total / ratings[name].count).toFixed(2));
            });

            return result;
        };

        const getLoyaltyRate = (): number => {
            const clients: Record<string, number> = {};

            userData.history.forEach(service => {
                if (service.status !== 'Finalizado') return;

                const clientId = service.costumer._id;

                if (!clients[clientId]) {
                    clients[clientId] = 0;
                }
                clients[clientId]++;
            });

            const totalClients = Object.keys(clients).length;
            const returningClients = Object.values(clients).filter(count => count > 1).length;

            if (totalClients === 0) return 0;

            return parseFloat(((returningClients / totalClients) * 100).toFixed(2));
        };

        const groupedAppointments = groupAppointments(type);
        const uniqueCustomersCount = getUniqueCustomersCount(type);
        const newVsReturning = getNewvsReturning(type);
        const highestPeriods = getHighestPeriods();
        const averageRatingByService = getAverageRatingByService();
        const loyaltyRate = getLoyaltyRate();

        return {
            userData: returnUserData,
            generatedIncome,
            groupedAppointments,
            uniqueCustomersCount,
            newVsReturning,
            highestPeriods,
            averageRatingByService,
            loyaltyRate
        }

    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getBarbers(): Promise<User[] | null> {
        const barberRoles = await this.roleService.findBarberRoles();
        const barberUsers = await this.userModel.find({ role: { $in: barberRoles } }).exec();

        return barberUsers;
    }

    async getBarbersFull(): Promise<User[] | null> {
        const barberRoles = await this.roleService.findBarberRoles();
        const barberUsers = await this.userModel.find({ role: { $in: barberRoles } }).populate('work.services').populate('history').exec();

        return barberUsers;
    }

    async getCustomersFull(): Promise<User[] | null> {
        const customerUsers = await this.userModel.find({ role: 0 }).populate({ path: 'history', populate: [{ path: 'service' }, { path: 'barber' }] }).exec();

        return customerUsers;
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

    async getBarberDays(barberId: string): Promise<any[]> {
        const barber = await this.userModel.findById(barberId).exec();
        if(!barber || !barber.work) {
            throw new NotFoundException('Barbeiro não encontrado ou não possui agenda configurada')
        }

        const { days } = barber.work;
        if(!days || days.length === 0) {
            return[];
        }

        dayjs.locale('pt-br');

        const date = dayjs(new Date());
        const year = date.year()
        const month = date.month() + 1;
        const day = date.date();

        const startOfPeriod = dayjs(`${year}-${month}-${day}`);
        const endOfPeriod = startOfPeriod.add(15, 'day');

        const barberDays: any[] = [];

        let currentDay = startOfPeriod.clone();

        while (currentDay.isBefore(endOfPeriod) || currentDay.isSame(endOfPeriod)) {
            const weekday = currentDay.format('dddd').toLowerCase();

            if (days.includes(weekday)) {
                barberDays.push({ day: currentDay.format('YYYY-MM-DD'), available: true });
            } else {
                barberDays.push({ day: currentDay.format('YYYY-MM-DD'), available: false })
            }

            currentDay = currentDay.add(1, 'day')
        }

        return barberDays;
    }

    async getUserDiscount(userId: string, serviceId: string): Promise<number> {
        const userSubscription = await this.subscriptionService.getActiveSubscriptionByUser(userId);
        const service = await this.serviceService.findById(serviceId);

        if (!userSubscription || !service) return 0;

        if (typeof userSubscription.planId === 'string') return 0

        let userBenefits: Benefit[] = [...userSubscription.planId.benefits];

        const otherPlanRef = userBenefits.find( benefit => benefit.type === "other_plan_benefits" );

        if (otherPlanRef) {
            // @ts-ignore
            const otherPlanBenefits = await this.planService.getBenefits(otherPlanRef.conditions?.targetPlan);
            // @ts-ignore
            userBenefits = [...userBenefits, ...otherPlanBenefits]
        }
        
        console.log(userBenefits)

        const freeService = userBenefits.find(
            // @ts-ignore
            benefit => benefit.type === "free_service" && benefit.conditions?.appliesTo === service?.category
        );
        
        if (freeService) {
            return 100
        }
        
        const discount = userBenefits.find(
            // @ts-ignore
            benefit => benefit.key === "discount_appointments" && benefit.type === "percentage" && benefit.conditions?.appliesTo === service?.category
        );

        if (discount) {
            return 15
        }

        return 0;

    }

    async addServices(id: string, services: string[]): Promise<User> {
        const updated = await this.userModel.findByIdAndUpdate(
            id,
            { $addToSet: { 'work.services': { $each: services } } },
            { new: true }
        )
        if(!updated) {
            throw new NotFoundException('Usuário não encontrado para atualização')
        }
        return updated;
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

    async fix(id: string): Promise<string | null> {
        const result = await this.userModel.updateOne(
            { _id: id }, 
            { $unset: { history: '', subscription: '' } }
        );
        return `${result.modifiedCount} usuários modificados`
    }
}

/* 
    CALCULAR NOVA MEDIA

    newAverage = (oldAverage * ratingCount + newRating) / (ratingCount + 1)
    ratingCount += 1

*/