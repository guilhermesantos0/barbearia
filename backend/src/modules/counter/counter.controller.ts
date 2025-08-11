import { Controller, Param, Post } from "@nestjs/common";
import { CounterService } from "./counter.service";

@Controller('/counters')
export class CounterController {
    constructor(private readonly counterService: CounterService) {}

    @Post('reset/:sequenceName')
    async reset (@Param('sequenceName') sequenceName: string) {
        return this.counterService.reset(sequenceName, 0);
    }
}