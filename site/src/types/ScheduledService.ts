import { ICostumer } from "./Costumer"
import { IEmployee } from "./Empoyee"
import { IService } from "./Service"

export interface IScheduledService {
    _id: string,
    costumer: ICostumer,
    barber: IEmployee,
    service: IService,
    date: Date,
    complete: boolean,
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