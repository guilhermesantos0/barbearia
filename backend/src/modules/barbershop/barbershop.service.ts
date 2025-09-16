import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Barbershop, BarbershopDocument } from "./schemas/barbershop.schema";
import { CreateBarbershopDto } from "./dto/create-barbershop.dto";
import { UpdateBarbershopDto } from "./dto/update-barbershop.dto";

@Injectable()
export class BarbershopService {
    constructor(
        @InjectModel(Barbershop.name) private barbershopModel: Model<BarbershopDocument>,
    ) {}

    async create(createBarbershopDto: CreateBarbershopDto): Promise<Barbershop> {
        const barberShop = new this.barbershopModel(createBarbershopDto);
        return barberShop.save();
    }

    async getInfo(): Promise<Barbershop | null> {
        return this.barbershopModel.findOne().exec();
    }

    async findAll(): Promise<Barbershop[]> {
        return this.barbershopModel.find().exec();
    }

    async findOne(id: string): Promise<Barbershop> {
        const barberShop = await this.barbershopModel.findById(id).exec();
        if (!barberShop) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
        return barberShop;
    }

    async update(id: string, updateBarbershopDto: UpdateBarbershopDto): Promise<Barbershop> {
        const updated = await this.barbershopModel.findByIdAndUpdate(id, updateBarbershopDto, {
            new: true,
        });
        if (!updated) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.barbershopModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
    }

    async addHoliday(date: string): Promise<Barbershop> {
        const barbershop = await this.barbershopModel.findOne().exec();
        if (!barbershop) {
            throw new NotFoundException('BarberShop not found');
        }
        
        if (!barbershop.holidays.includes(date)) {
            barbershop.holidays.push(date);
            await barbershop.save();
        }
        
        return barbershop;
    }

    async removeHoliday(date: string): Promise<Barbershop> {
        const barbershop = await this.barbershopModel.findOne().exec();
        if (!barbershop) {
            throw new NotFoundException('BarberShop not found');
        }
        
        barbershop.holidays = barbershop.holidays.filter(holiday => holiday !== date);
        await barbershop.save();
        
        return barbershop;
    }
}
