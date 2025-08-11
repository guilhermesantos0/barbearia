import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Costumer, CostumerDocument } from './schemas/costumer.schema';
import { PasswordService } from 'src/common/services/password.service';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { AuthService } from '../auth/auth.service';

import { AuthenticatedUserResponse } from './AuthenticatedUserResponse.type';

@Injectable()
export class CostumerService {
    constructor(
        @InjectModel(Costumer.name) 
        private costumerModel: Model<CostumerDocument>,
        private passwordService: PasswordService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {}

    async create(data: CreateCostumerDto): Promise<Costumer> {
        const hashedPassword = await this.passwordService.hash(data.password!)
        const newCostumer = new this.costumerModel({
            ...data,
            password: hashedPassword
        });
        return newCostumer.save();
    }

    async addScheduledService(clientId: string, serviceId: string): Promise<void> {
        await this.costumerModel.findByIdAndUpdate(clientId, { $push: { history: serviceId }}, { new: true }).exec();
    }

    async findAll(): Promise<Costumer[]> {
        return this.costumerModel.find().exec();
    }

    async findById(id: string): Promise<Costumer | null> {
        return this.costumerModel.findById(id)
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

    async findByEmail(email: string): Promise<Costumer | null> {
        return this.costumerModel.findOne({ email: email })
            .lean()
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

    async update(id: string, data: Partial<Costumer>): Promise<Costumer | null> {
        return this.costumerModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async updatePatch(id: string, data: Partial<Costumer>): Promise<AuthenticatedUserResponse> {
        if(data.password) {
            data.password = await this.passwordService.hash(data.password)
        }

        const updatedUser = await this.costumerModel.findByIdAndUpdate(id, data, { new: true })
            .lean()
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

        if(!updatedUser) throw new BadRequestException('Usuário não encontrado');

        const reponse = await this.authService.generateToken(updatedUser, '7d');

        return reponse;
    }

    async delete(id: string): Promise<Costumer | null> {
        return this.costumerModel.findByIdAndDelete(id).exec();
    }
}