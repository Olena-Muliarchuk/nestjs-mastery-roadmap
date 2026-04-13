import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Song } from '../songs/song.entity';
import { Artist } from '../artists/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
