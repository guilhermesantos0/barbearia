import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>
    ) {}

    async create(data: Partial<Employee>): Promise<Employee> {
        const newEmployee = new this.employeeModel(data);
        return newEmployee.save();
    }

    async addScheduledService(employeeId: string, serviceId: string): Promise<void> {
        await this.employeeModel.findByIdAndUpdate(employeeId, { $push: { nextServices: serviceId } }, { new: true }).exec()
    }

    async findAll(): Promise<Employee[]> {
        return this.employeeModel.find().exec();
    }

    async findById(id: string): Promise<Employee | null> {
        return this.employeeModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return this.employeeModel.findOne({ email: email }).select('-pasword').exec();
    }

    async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
        return this.employeeModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Employee | null> {
        return this.employeeModel.findByIdAndDelete(id).exec();
    }
}
