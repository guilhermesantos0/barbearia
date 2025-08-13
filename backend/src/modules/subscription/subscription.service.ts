import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Subscription, SubscriptionDocument } from './schemas/subscription.schema'
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>
    ) {}

    async getActiveSubscriptionByUser(userId: string) {
        return this.subscriptionModel.findOne({
            userId,
            status: 'active',
            endDate: { $gt: new Date() }
     
        }).populate('planId');
    }
}
