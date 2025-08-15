import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PasswordService } from 'src/common/services/password.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private passwordService: PasswordService,
        private readonly subscriptionService: SubscriptionService
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
                match: { discountApplied: { $ne: 0 } } 
            });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
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
