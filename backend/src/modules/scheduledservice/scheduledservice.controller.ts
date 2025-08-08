import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put
} from '@nestjs/common';

import { ScheduledServiceService } from './scheduledservice.service';
import { CreateScheduledServiceDto } from './dto/create-scheduledservice.dto';
import { ScheduledService } from './schemas/scheduledservice.schema';
import { UserService } from '../user/user.service';
import { UpdateScheduledServiceDto } from './dto/update-scheduledservice.dto';

@Controller('/scheduledservices')
export class ScheduledServiceController {
    constructor(
        private readonly scheduledService: ScheduledServiceService,
        private userService: UserService,
    ) {}

    @Post()
    async create(@Body() createScheduledServiceDto: CreateScheduledServiceDto) {
        const createdService = await this.scheduledService.create(createScheduledServiceDto);
        await this.userService.addScheduledService(createScheduledServiceDto.costumer, createdService._id);
        await this.userService.addScheduledService(createScheduledServiceDto.barber, createdService._id);

        return createdService
    }

    @Get()
    async findAll(): Promise<ScheduledService[]> {
        return this.scheduledService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ScheduledService | null> {
        return this.scheduledService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<ScheduledService>) {
        return this.scheduledService.update(id, updateData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.scheduledService.delete(id);
    }
}
