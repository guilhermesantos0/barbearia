import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Log } from './schemas/logs.schema';

@Controller('/logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @Get()
    async getAllLogs() {
        return this.logsService.getAllLogs();
    }

    @Get(':id')
    async getLogsByUserId(@Param('id') id: string) {
        return this.logsService.getResolvedLogsByUser(id);
    }

    @Post('teste')
    async createFakeLog(@Body() body: any) {
        return this.logsService.createLog(body)
    }

    @Patch(':id')
    async editLog(@Param('id') id: string, @Body() body: any) {
        return this.logsService.editLog(id, body);
    }

    // @Delete(':id')
    // async deleteLog(@Param('id') id: string) {
    //     return this.logsService.deleteLog(id);
    // }
}
