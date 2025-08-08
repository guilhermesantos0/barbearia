import { IService } from "./Service"
import { IUser } from "./User"

export interface IScheduledService {
    _id: string,
    costumer: IUser,
    barber: IUser,
    service: IService,
    date: Date,
    status: string,
    completedAt?: Date,
    rated: boolean,
    rate: {
        stars: number,
        comment: string,
        ratedAt: Date
    },
    createdAt: string | Date,
    editedAt: string | Date
}