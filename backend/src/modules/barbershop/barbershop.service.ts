import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BarberShop, BarberShopDocument } from "./schemas/barbershop.schema";
import { CreateBarberShopDto } from "./dto/create-barbershop.dto";
import { UpdateBarberShopDto } from "./dto/update-barbershop.dto";

@Injectable()
export class BarberShopService {
    constructor(
        @InjectModel(BarberShop.name) private barberShopModel: Model<BarberShopDocument>,
    ) {}

    async create(createBarberShopDto: CreateBarberShopDto): Promise<BarberShop> {
        const barberShop = new this.barberShopModel(createBarberShopDto);
        return barberShop.save();
    }

    async getInfo(): Promise<BarberShop | null> {
        return this.barberShopModel.findOne().exec();
    }

    async findAll(): Promise<BarberShop[]> {
        return this.barberShopModel.find().exec();
    }

    async findOne(id: string): Promise<BarberShop> {
        const barberShop = await this.barberShopModel.findById(id).exec();
        if (!barberShop) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
        return barberShop;
    }

    async update(id: string, updateBarberShopDto: UpdateBarberShopDto): Promise<BarberShop> {
        const updated = await this.barberShopModel.findByIdAndUpdate(id, updateBarberShopDto, {
            new: true,
        });
        if (!updated) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.barberShopModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException(`BarberShop with id ${id} not found`);
        }
    }
}
