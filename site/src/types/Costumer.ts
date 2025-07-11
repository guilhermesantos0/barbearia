import { ScheduledService } from "./ScheduledService"

export interface Costumer {
    _id: string,
    name: string,
    email: string,
    phone: string,
    cpf: string,
    profilePic: string,
    premiumTier: number,
    history: ScheduledService[],
    createdAt: string | Date,
    editedAt: string | Date
}