export interface ILog {
    userId: string;
    target: string;
    action: string;
    data?: Record<string, any>;
    timestamp: Date;
}