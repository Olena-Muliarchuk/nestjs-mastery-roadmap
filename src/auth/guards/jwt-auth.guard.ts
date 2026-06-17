import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface GqlContext {
  req: Request;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    switch (context.getType<GqlContextType>()) {
      case 'http':
        return context.switchToHttp().getRequest<Request>();

      case 'graphql':
        return GqlExecutionContext.create(context).getContext<GqlContext>().req;

      default:
        throw new Error(`Unsupported execution context type: ${context.getType()}`);
    }
  }
}
