import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/logs.schema';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(d.getTime())) return 'Data inválida';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    
    return `${day}/${month}`;
};

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
        return this.logModel
            .find({ userId })
            .populate({
                path: 'userId',
                select: 'name profilePic'
            })
            .lean()
            .exec();
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

                        const formattedDate = formatDate(target.date);                            

                        if(target && target.service && typeof target.service === 'object') {
                            target.name = `${target.service.name} - ${formattedDate} `
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

    async editLog(id, updateData)  {
        const updated = await this.logModel.findByIdAndUpdate(id, updateData, { new: true })
        if(!updated) {
            throw new NotFoundException('Log não encontrada para atualização')
        }

        return updated

        // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        //         const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        //         if (!updated) {
        //             throw new NotFoundException('Usuário não encontrado para atualização');
        //         }
        //         return updated;
        //     }
    }
}
