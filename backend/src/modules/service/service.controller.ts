import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { Service } from './schemas/service.schema';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/services')
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

    @Get('active')
    async findActive() {
        return this.serviceService.findActive();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.serviceService.findById(id);
    }

    

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Request() req, @Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.serviceService.update(id, updateServiceDto, req.user.sub);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/status')
    async updateStatus(@Request() req, @Param('id') id: string, @Body() UpdateServiceDto: UpdateServiceDto) {
        return this.serviceService.updateStatus(id, UpdateServiceDto, req.user.sub);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.serviceService.delete(id);
    }
}
