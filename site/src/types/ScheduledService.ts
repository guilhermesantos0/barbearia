import { IService } from "./Service"
import { IUser } from "./User"

export interface IScheduledService {
    _id: string,
    costumer: IUser,
    barber: IUser,
    service: IService,
    date: Date,
    status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Atrasado' | 'Em andamento' | 'Finalizado',
    completedAt?: Date,
    rated: boolean,
    rate: {
        stars: number,
        comment: string,
        ratedAt: Date
    },
    discountApplied: number,
    createdAt: string | Date,
    editedAt: string | Date
}