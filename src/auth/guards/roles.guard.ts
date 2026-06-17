import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { ActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = this.getUser(context);

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }

  private getUser(context: ExecutionContext): ActiveUser | undefined {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest<{ user: ActiveUser }>().user;
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: { user: ActiveUser } }>().req.user;
  }
}
