import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Subscription, SubscriptionDocument } from './schemas/subscription.schema'
import { Model } from 'mongoose';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>
    ) {}

    async create(data: Partial<Subscription>): Promise<Subscription> {
        const newSubscription = new this.subscriptionModel(data);
        return newSubscription.save();
    }

    async find(): Promise<Subscription[] | null> {
        return this.subscriptionModel.find()
    }

    async findById(id: string): Promise<Subscription | null> {
        return this.subscriptionModel.findOne({ _id: id }).exec();
    }

    async getActiveSubscriptionByUser(userId: string) {
        return this.subscriptionModel.findOne({
            userId,
            status: 'active',
            endDate: { $gt: new Date() }
     
        }).populate('planId').populate('userId');
    }

    async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
        const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateSubscriptionDto, { new: true });
        if (!updated) {
            throw new NotFoundException('Assinatura não encontrada para atualização')
        }
        return updated;
    }

    async remove(id: string) {
        return this.subscriptionModel.findByIdAndDelete(id)
    }
}
