import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './schemas/employee.schema';

@Controller('/employees')
export class EmployeeController {
    constructor(private readonly emplolyeeService: EmployeeService) {}

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.emplolyeeService.create(createEmployeeDto);
    }

    @Get()
    async findAll() {
        return this.emplolyeeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.emplolyeeService.findById(id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: Partial<Employee>) {
        return this.emplolyeeService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.emplolyeeService.delete(id);
    }
}
