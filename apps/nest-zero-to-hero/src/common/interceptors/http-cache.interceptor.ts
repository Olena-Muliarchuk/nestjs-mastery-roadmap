import { CACHE_MANAGER, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Observable, of, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Request as ExpressRequest } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const ttl = this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler()) ?? 60000;

    const cacheKey = this.generateCacheKey(request);

    return from(this.cacheManager.get(cacheKey)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          this.logger.log(`Cache HIT: ${cacheKey}`);
          return of(cachedResponse);
        }

        return next.handle().pipe(
          tap((response) => {
            this.cacheManager
              .set(cacheKey, response, ttl)
              .then(() => {
                this.logger.log(`Cache MISS (Saved): ${cacheKey}`);
              })
              .catch((error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : String(error);
                this.logger.error(`Failed to cache key: ${cacheKey}`, errorMessage);
              });
          }),
        );
      }),
    );
  }

  private generateCacheKey(request: any): string {
    return `api:${request.url}`;
  }
}
