import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { StorageModule } from 'src/storage/storage.module';
import { AudioModule } from 'src/audio/audio.module';
import { SongsResolver } from './songs.resolver';
import { ArtistsModule } from 'src/artists/artists.module';
import { ArtistsLoader } from './loaders/artists.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist]), StorageModule, AudioModule, ArtistsModule],
  controllers: [SongsController],
  providers: [SongsService, SongsResolver, ArtistsLoader],
})
export class SongsModule {}
