import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

import { RoleService } from "src/modules/role/role.service";

import { Permission } from "../decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private rolesService: RoleService, 
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) {
            return true; 
        }

        const { user } = context.switchToHttp().getRequest();

        const role = await this.rolesService.findById(user.roleId);
        if (!role) {
            throw new ForbiddenException('Role não encontrada');
        }

        const hasPermission = requiredPermissions.every((permission) =>
            role.permissions?.[permission.module]?.[permission.action] === true
        );

        if (!hasPermission) {
            throw new ForbiddenException('Permissão negada');
        }

        return true;
    }
}