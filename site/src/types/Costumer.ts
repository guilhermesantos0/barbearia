import { IScheduledService } from "./ScheduledService"

export interface ICostumer {
    _id: string,
    name: string,
    role: number,
    email: string,
    phone: string,
    cpf: string,
    bornDate: Date,
    gender: string,
    profilePic: boolean,
    premiumTier: number,
    history: IScheduledService[],
    createdAt: string | Date,
    editedAt: string | Date
}