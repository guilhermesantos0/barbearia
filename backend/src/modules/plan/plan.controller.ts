import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from './schemas/plan.schema';

import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('/plantiers')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Post()
    async create(@Body() createPlanDto: CreatePlanDto) {
        return this.planService.create(createPlanDto);
    }

    @Post('/reset')
    async reset() {
        this.planService.reset();
    }

    @Get()
    async findAll() {
        return this.planService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.planService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: Partial<Plan>) {
        return this.planService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.planService.delete(id);
    }
}
