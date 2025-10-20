import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BarbershopService } from "./barbershop.service";
import { CreateBarbershopDto } from "./dto/create-barbershop.dto";
import { UpdateBarbershopDto } from "./dto/update-barbershop.dto";
import { Barbershop } from "./schemas/barbershop.schema";

@Controller("barbershops")
export class BarbershopController {
    constructor(private readonly barberShopService: BarbershopService) {}

    @Post()
    create(@Body() createBarberShopDto: CreateBarbershopDto) {
        return this.barberShopService.create(createBarberShopDto);
    }

    @Get()
    getBarberShop(): Promise<Barbershop | null> {
        return this.barberShopService.getInfo();
    }
    
    @Get("times")
    getTimes() {
        return this.barberShopService.getTimes();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.barberShopService.findOne(id);
    }


    @Patch(":id")
    update(@Param("id") id: string, @Body() updateBarberShopDto: UpdateBarbershopDto) {
        return this.barberShopService.update(id, updateBarberShopDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.barberShopService.remove(id);
    }

    @Post("holidays")
    addHoliday(@Body() body: { date: string }) {
        return this.barberShopService.addHoliday(body.date);
    }

    @Delete("holidays/:date")
    removeHoliday(@Param("date") date: string) {
        return this.barberShopService.removeHoliday(date);
    }
}
