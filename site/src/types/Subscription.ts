import { IUser } from "./User";

export interface ISubscription {
    _id: string,
    userId: string | IUser,
    planId: string,
    startDate: Date,
    endDate: Date,
    status: 'active' | 'paused' | 'canceled',
    autoRenew: boolean
}