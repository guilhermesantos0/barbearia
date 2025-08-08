import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/logs.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogsService {
    constructor(
        @InjectModel(Log.name) private logModel: Model<LogDocument>
    ) {}

    async createLog(data: Partial<Log>) {
        const log = new this.logModel({
            ...data,
            target: data.target ?? data.userId
        });

        return await log.save();
    }

    async getAllLogs() {
        return this.logModel.find();
    }

    async getLogsByUser(userId: string) {
        return this.logModel.find({ userId })
    }
}
