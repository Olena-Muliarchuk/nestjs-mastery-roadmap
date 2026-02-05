import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
  };
}

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});
