import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('/subscriptions')
export class SubscriptionController {
    constructor (private readonly subscriptionService: SubscriptionService) {}
    
    @Post()
    async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionService.create(createSubscriptionDto)
    }

    @Get()
    async getSubscription() {
        return this.subscriptionService.find();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.subscriptionService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
        return this.subscriptionService.update(id, updateSubscriptionDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.subscriptionService.remove(id);
    }
}
