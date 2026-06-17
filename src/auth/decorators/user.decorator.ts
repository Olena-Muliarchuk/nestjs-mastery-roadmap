import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ActiveUser } from '../interfaces/active-user.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: ActiveUser;
}

interface GqlContext {
  req: RequestWithUser;
}

export const User = createParamDecorator(
  (field: keyof ActiveUser | undefined, ctx: ExecutionContext) => {
    let user: ActiveUser | undefined;

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<{ user: ActiveUser }>();
      user = request.user;
    } else if (ctx.getType<GqlContextType>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      const context = gqlCtx.getContext<GqlContext>();
      user = context.req?.user;
    }

    return field ? user?.[field] : user;
  },
);
