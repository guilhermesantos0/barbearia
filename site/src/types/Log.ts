import { IUser } from "./User";

interface ITarget {
    _id: string,
    name: string
}

export interface ILog {
    userId: string | IUser;
    target: ITarget;
    action: string;
    data?: Record<string, any>;
    timestamp: Date;
}