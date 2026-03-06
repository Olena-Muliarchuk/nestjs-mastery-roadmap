import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const redisAsyncConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: parseInt(configService.get<string>('REDIS_PORT', '6379')),
      },
      ttl: 60 * 1000, // 1 min
    });

    return {
      store: store as any,
    };
  },
};
