import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/logs.schema';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { TargetType } from './schemas/target-type.enum';

@Injectable()
export class LogsService {
    constructor(
        @InjectModel(Log.name) private logModel: Model<LogDocument>,
        @InjectConnection() private connection: Connection 
    ) {}

    async createLog(data: Partial<Log>) {
        const log = new this.logModel({
            ...data,
            target: data.target ?? data.userId,
            targetType: data.targetType ?? 'User'
        });

        return await log.save();
    }

    async getAllLogs(): Promise<Log[]> {
        return this.logModel.find().lean().exec();
    }

    async getLogsByUser(userId: string): Promise<Log[]> {
        return this.logModel.find({ userId }).lean().exec();
    }

    async deleteLog(id: string) {
        return this.logModel.findByIdAndDelete(id);
    }

    async getResolvedLogsByUser(userId: string) {
        const logs = await this.getLogsByUser(userId);
        
        const resolvedLogs = await Promise.all(
            logs.map(async (log) => {
                try {
                    const model = this.connection.model(log.targetType);

                    let target;

                    if (log.targetType === 'ScheduledService') {
                        target = await model
                            .findById(log.target)
                            .select('service date')
                            .populate ({
                                path: 'service',
                                select: 'name -_id'
                            })
                            .lean()
                            .exec()

                        if(target && target.service && typeof target.service === 'object') {
                            target.name = target.service.name
                        }

                        delete target.service
                    } else {
                        target = await model
                            .findById(log.target)
                            .select('name')
                            .lean()
                            .exec();
                    }


                    return { ...log, target };
                    
                } catch {
                    return { ...log, target: null };
                }
            })
        );

        return resolvedLogs;
    }
}
