import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Log } from './schemas/logs.schema';

@Controller('/logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Get(':id')
    async getLogsByUserId(@Param('id') id: string) {
        return this.logsService.getLogsByUser(id);
    }

    @Post('teste')
    async createFakeLog(@Body() body: any) {
        return this.logsService.createLog(body)
    }
}
