import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BarbershopService } from "./barbershop.service";
import { BarbershopController } from "./barbershop.controller";
import { Barbershop, BarbershopSchema } from "./schemas/barbershop.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Barbershop.name, schema: BarbershopSchema }])],
    controllers: [BarbershopController],
    providers: [BarbershopService],
})
export class BarbershopModule {}
