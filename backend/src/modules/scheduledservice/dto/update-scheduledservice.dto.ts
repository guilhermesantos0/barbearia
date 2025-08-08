import { PartialType } from "@nestjs/mapped-types";
import { CreateScheduledServiceDto } from "./create-scheduledservice.dto";

export class UpdateScheduledServiceDto extends PartialType(CreateScheduledServiceDto) {}