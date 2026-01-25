import { Controller, Get, Post, Body } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import type { Song } from './interfaces/song.interface';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsServices: SongsService) {}

  @Get()
  getAll(): Song[] {
    return this.songsServices.getAllSongs();
  }

  @Post()
  create(@Body() createSongDto: CreateSongDto): Song {
    return this.songsServices.create(createSongDto);
  }
}
