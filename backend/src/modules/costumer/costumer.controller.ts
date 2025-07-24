import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { Costumer } from './schemas/costumer.schema';

import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';

import { AuthenticatedUserResponse } from './AuthenticatedUserResponse.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/costumers')
export class CostumerController {
    constructor(private readonly costumerService: CostumerService) {}

    @Post()
    async create(@Body() createCostumerDto: CreateCostumerDto) {
        return this.costumerService.create(createCostumerDto);
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

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updatePatch(@Param('id') id: string, @Body() updateData: UpdateCostumerDto): Promise<AuthenticatedUserResponse> {
        console.log('a')
        console.log(id, updateData)
        return this.costumerService.updatePatch(id, updateData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.costumerService.delete(id);
    }
}
