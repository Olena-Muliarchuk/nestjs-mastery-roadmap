import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from '@app/nest-zero-to-hero/artists/entities/artist.entity';
import { StorageModule } from '@app/nest-zero-to-hero/storage/storage.module';
import { AudioModule } from '@app/nest-zero-to-hero/audio/audio.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist]), StorageModule, AudioModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
