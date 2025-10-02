import { Body, Controller, Delete, Get, Param, Post, Put, Patch } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from './schemas/plan.schema';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('/plans')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Post()
    async create(@Body() createPlanDto: CreatePlanDto) {
        return this.planService.create(createPlanDto);
    }

    @Get()
    async findAll() {
        return this.planService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.planService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: Partial<Plan>) {
        return this.planService.update(id, data);
    }

    // @Patch(':id/status')
    // async updateStatus(@Param('id') id: string, @Body() body: { active: boolean }) {
    //     return this.planService.update(id, { active: body.active });
    // }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() UpdatePlanDto: UpdatePlanDto) {
        return this.planService.updateStatus(id, UpdatePlanDto);
    }

    @Patch(':id/benefits/:benefitId/conditions')
    async updateBenefitConditions(
        @Param('id') planId: string,
        @Param('benefitId') benefitId: string,
        @Body() conditions: any
    ) {
        return this.planService.updateBenefitConditions(planId, benefitId, conditions);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.planService.remove(id);
    }
}
