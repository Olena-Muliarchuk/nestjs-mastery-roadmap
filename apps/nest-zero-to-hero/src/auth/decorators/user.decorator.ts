import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUser } from '@app/contracts';

export const User = createParamDecorator(
  (field: keyof ActiveUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: ActiveUser }>();

    const user = request.user;

    return field ? user?.[field] : user;
  },
);
