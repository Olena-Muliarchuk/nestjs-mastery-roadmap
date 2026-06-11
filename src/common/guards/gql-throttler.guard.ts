import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

interface GqlContext {
  req: Request;
  res: Response;
}

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return super.getRequestResponse(context);
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<GqlContext>();

    if (!ctx.req || !ctx.res) {
      throw new Error(
        'GraphQL context missing req or res. Ensure context is configured as: context: ({ req, res }) => ({ req, res })',
      );
    }

    return {
      req: ctx.req,
      res: ctx.res,
    };
  }
}
