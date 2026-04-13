import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';

export const redisAsyncConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisConfig');

    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<string>('REDIS_PORT');
    const redisUrl = `redis://${host}:${port}/1`;

    const store = new KeyvRedis(redisUrl);

    store.on('error', (err: unknown) => {
      let message = 'Unknown Redis error';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }

      logger.error(`Redis connection error: ${message}`);
    });

    logger.log(`Initialized Redis storage at ${host}:${port}`);

    return {
      stores: [store],
      ttl: 60 * 1000,
    };
  },
};
