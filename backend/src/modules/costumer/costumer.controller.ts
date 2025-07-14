import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { Costumer } from './schemas/costumer.schema';

@Controller('costumer')
export class CostumerController {
    constructor(private readonly costumerService: CostumerService) {}

    @Post()
    async create(@Body() data: Partial<Costumer>) {
        return this.costumerService.create(data);
    }

    @Get()
    async findAll() {
        return this.costumerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.costumerService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: Partial<Costumer>) {
        return this.costumerService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.costumerService.delete(id);
    }
}
