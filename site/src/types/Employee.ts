import { IRole } from "./Role"
import { IScheduledService } from "./ScheduledService"
import { IService } from "./Service"

interface Interval {
    name: string,
    start: string,
    end: string
}

export interface IEmployee {
    _id: string,
    role: IRole,
    name: string,
    email: string,
    profilePic: string,
    phone: string,
    cpf: string,
    nextServices: IScheduledService[],
    lastServices: IScheduledService[],
    work: {
        days: string[],
        time: {
            start: string,
            end: string,
            intervals: Interval[]
        }
    },
    services: IService[],
    createdAt: string | Date,
    editedAt: string | Date
}