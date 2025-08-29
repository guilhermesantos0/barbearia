import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './schemas/role.schema';

import { CreateRoleDto } from './dto/create-role.dto';

@Controller('/roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    async findAll() {
        return this.roleService.findAll();
    }

    
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.roleService.findById(id);
    }

    @Get(':id/isBarber')
    async findIsBarber(@Param('id') id: number) {
        return this.roleService.findIsBarber(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: Partial<Role>) {
        return this.roleService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.roleService.delete(id);
    }
}
