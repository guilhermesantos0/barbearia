import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BarberShopService } from "./barbershop.service";
import { BarberShopController } from "./barbershop.controller";
import { BarberShop, BarberShopSchema } from "./schemas/barbershop.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: BarberShop.name, schema: BarberShopSchema }])],
    controllers: [BarberShopController],
    providers: [BarberShopService],
})
export class BarberShopModule {}
