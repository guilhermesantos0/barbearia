import { IScheduledService } from "./ScheduledService";
import { IService } from "./Service";
import { IRole } from "./Role";
import { ILog } from "./Log";
import { ISubscription } from "./Subscription";

interface Interval {
    name: string;
    start: string;
    end: string;
}

export interface IUser {
    _id: string;
    role: number | IRole; 
    name: string;
    email: string;
    phone: string;
    cpf: string;
    bornDate: Date;
    gender: string;
    profilePic: string;

    history: IScheduledService[];

    work?: {
        days: string[];
        time: {
            start: string;
            end: string;
            intervals: Interval[];
        };
    };

    services?: IService[];

    subscription: ISubscription[] | string[];

    logs?: ILog[];

    averageRating: number,
    ratingCount: number

    createdAt: string | Date;
    updatedAt: string | Date;
}
