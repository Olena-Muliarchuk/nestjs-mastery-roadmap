import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '@app/contracts';
import { ROLES_KEY } from './roles.decorator';

/**
 * Combined authentication and authorization decorator
 *
 * @param roles - Optional roles required to access the endpoint.
 *                If no roles provided, only authentication is required.
 *
 * @example
 * // Only authentication
 * @Auth()
 *
 * @example
 * // Admin role required
 * @Auth(Role.Admin)
 *
 * @example
 * // Admin OR Moderator role required
 * @Auth(Role.Admin, Role.Moderator)
 */
export function Auth(...roles: Role[]) {
  const decorators = [
    ApiBearerAuth(),
    UseGuards(AuthGuard('jwt')),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  ];

  if (roles.length > 0) {
    decorators.push(SetMetadata(ROLES_KEY, roles));
    decorators.push(UseGuards(RolesGuard));
  }

  return applyDecorators(...decorators);
}
