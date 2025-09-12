import { PartialType } from "@nestjs/mapped-types";
import { CreateBarberShopDto } from "./create-barbershop.dto";

export class UpdateBarberShopDto extends PartialType(CreateBarberShopDto) {}
