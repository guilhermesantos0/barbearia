import { Costumer } from "./Costumer"
import { Employee } from "./Empoyee"
import { Service } from "./Service"

export interface ScheduledService {
    _id: string,
    costumer: Costumer,
    barber: Employee,
    service: Service,
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