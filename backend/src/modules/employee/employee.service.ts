import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name) private emplyeeModel: Model<EmployeeDocument>
    ) {}

    async create(data: Partial<Employee>): Promise<Employee> {
        const newEmployee = new this.emplyeeModel(data);
        return newEmployee.save();
    }

    async findAll(): Promise<Employee[]> {
        return this.emplyeeModel.find().exec();
    }

    async findById(id: string): Promise<Employee | null> {
        return this.emplyeeModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
        return this.emplyeeModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Employee | null> {
        return this.emplyeeModel.findByIdAndDelete(id).exec();
    }
}
