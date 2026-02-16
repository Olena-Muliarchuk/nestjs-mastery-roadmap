import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from './songs/songs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './env.validation';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistsModule } from './playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'), // the same that in docker on the left side
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    SongsModule,
    ArtistsModule,
    UsersModule,
    AuthModule,
    PlaylistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
