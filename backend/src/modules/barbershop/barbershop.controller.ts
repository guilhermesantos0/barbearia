import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BarberShopService } from "./barbershop.service";
import { CreateBarberShopDto } from "./dto/create-barbershop.dto";
import { UpdateBarberShopDto } from "./dto/update-barbershop.dto";
import { BarberShop } from "./schemas/barbershop.schema";

@Controller("barbershops")
export class BarberShopController {
    constructor(private readonly barberShopService: BarberShopService) {}

    @Post()
    create(@Body() createBarberShopDto: CreateBarberShopDto) {
        return this.barberShopService.create(createBarberShopDto);
    }

    @Get()
    getBarberShop(): Promise<BarberShop | null> {
        return this.barberShopService.getInfo();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.barberShopService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateBarberShopDto: UpdateBarberShopDto) {
        return this.barberShopService.update(id, updateBarberShopDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.barberShopService.remove(id);
    }
}
