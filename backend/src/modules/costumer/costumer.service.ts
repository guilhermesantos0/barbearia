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

    async updatePatch(id: string, data: Partial<Costumer>): Promise<AuthenticatedUserResponse> {
        if(data.password) {
            data.password = await this.passwordService.hash(data.password)
        }

        const updatedUser = await this.costumerModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();

        if(!updatedUser) throw new BadRequestException('Usuário não encontrado');

        const newToken = await this.authService.generateToken(updatedUser);

        console.log('UPDATED USER: ', updatedUser)

        return {
            access_token: newToken,
            user: updatedUser
        }
    }

    async delete(id: string): Promise<Costumer | null> {
        return this.costumerModel.findByIdAndDelete(id).exec();
    }
}