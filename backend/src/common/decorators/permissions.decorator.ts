import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = 'permissions';

export interface Permission {
    module: string,
    action: string
}

export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);