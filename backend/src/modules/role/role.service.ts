import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) {}

    async create(data: CreateRoleDto): Promise<Role> {
        const created = new this.roleModel({
            ...data,
            permissions: data.permissions,
        });

        return created.save();
    }

    async findAll(): Promise<Role[]> {
        return this.roleModel.find().exec()
    }

    async findById(id: number): Promise<Role | null> {
        return this.roleModel.findById(id).exec();
    }

    async findIsBarber(id: number) : Promise<boolean> {
        const role = await this.roleModel.findById(id).exec();

        if(!role) return false;

        return role?.isBarber;
    }

    async getRoleType(id: number): Promise<string> {
        const role = await this.roleModel.findById(id).exec();

        if(!role) return 'cliente'

        if(role.isBarber && !role.isAdmin) return 'barbeiro'
        if(role.isAdmin && !role.isBarber) return 'admin'

        if(role.isBarber && role.isAdmin) return 'barbeiro-admin'

        return 'cliente'
    }

    async findBarberRoles() {
        const barberRoles = await this.roleModel.find({ isBarber: true }).exec();
        const barberRolesId = barberRoles.map((role) => role._id);
        
        return barberRolesId;
    }

    async update(id: number, data: Partial<Role>): Promise<Role | null> {
        return this.roleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: number): Promise<Role | null> {
        return this.roleModel.findByIdAndDelete(id).exec();
    }
}
