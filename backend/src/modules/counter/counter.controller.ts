import { Controller, Param, Post } from "@nestjs/common";
import { CounterService } from "./counter.service";

@Controller('/counters')
export class CounterController {
    constructor(private readonly counterService: CounterService) {}

    @Post('reset/:id')
    async reset (@Param('id') id: string) {
        return this.counterService.reset(id);
    }
}