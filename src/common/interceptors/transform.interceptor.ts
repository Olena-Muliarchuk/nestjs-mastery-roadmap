import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T> | T> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<ExpressResponse>();

        if (response.statusCode === 204) {
          return data;
        }

        const contentTypeHeader = response.getHeader('content-type');
        const contentType = contentTypeHeader ? contentTypeHeader.toString() : '';

        if (contentType.includes('image/') || contentType.includes('application/pdf')) {
          return data;
        }

        if (typeof data === 'object' && data !== null && 'items' in data && 'meta' in data) {
          return data;
        }

        return {
          data,
          statusCode: response.statusCode,
          success: true,
        };
      }),
    );
  }
}
