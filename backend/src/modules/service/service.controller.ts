import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ServiceService } from './service.service';
import { Service } from './schemas/service.schema';

@Controller('/service')
export class ServiceController {
    constructor (private readonly serviceService: ServiceService) {}

    @Post()
    async create(@Body() data: Partial<Service>) {
        return this.serviceService.create(data);
    }

    @Get()
    async findAll() {
        return this.serviceService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.serviceService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: Partial<Service>) {
        return this.serviceService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.serviceService.delete(id);
    }
}
