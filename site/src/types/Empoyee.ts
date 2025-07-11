import { Role } from "./Role"
import { ScheduledService } from "./ScheduledService"
import { Service } from "./Service"

interface Interval {
    name: string,
    start: string,
    end: string
}

export interface Employee {
    _id: string,
    role: Role,
    name: string,
    email: string,
    phone: string,
    cpf: string,
    profilePic: string,
    nextServices: ScheduledService[],
    lastServices: ScheduledService[],
    work: {
        days: string[],
        time: {
            start: string,
            end: string,
            intervals: Interval[]
        }
    },
    services: Service[],
    createdAt: string | Date,
    editedAt: string | Date
}