import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
} from '@nestjs/common';

import { ScheduledServiceService } from './scheduledservice.service';
import { CreateScheduledServiceDto } from './dto/create-scheduledservice.dto';
import { ScheduledService } from './schemas/scheduledservice.schema';
import { CostumerService } from '../costumer/costumer.service';
import { EmployeeService } from '../employee/employee.service';

@Controller('/scheduledservices')
export class ScheduledServiceController {
    constructor(
        private readonly scheduledService: ScheduledServiceService,
        private costumerService: CostumerService,
        private employeeService: EmployeeService
    ) {}

    @Post()
    async create(@Body() createScheduledServiceDto: CreateScheduledServiceDto) {
        const createdService = await this.scheduledService.create(createScheduledServiceDto);
        await this.costumerService.addScheduledService(createScheduledServiceDto.costumer, createdService._id);
        await this.employeeService.addScheduledService(createScheduledServiceDto.barber, createdService._id);

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
