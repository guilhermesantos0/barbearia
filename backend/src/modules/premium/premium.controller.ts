import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PremiumService } from './premium.service';
import { Premium } from './schemas/premium.schema';

import { CreatePremiumDto } from './dto/create-premium.dto';

@Controller('/premiumtiers')
export class PremiumController {
    constructor(private readonly premiumService: PremiumService) {}

    @Post()
    async create(@Body() createPremiumDto: CreatePremiumDto) {
        return this.premiumService.create(createPremiumDto);
    }

    @Post('/reset')
    async reset() {
        this.premiumService.reset();
    }

    @Get()
    async findAll() {
        return this.premiumService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.premiumService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: Partial<Premium>) {
        return this.premiumService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.premiumService.delete(id);
    }
}
