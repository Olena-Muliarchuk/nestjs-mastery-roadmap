import { Controller, Get } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsServices: SongsService) {}

  @Get()
  getAll(): string[] {
    return this.songsServices.getAllSongs();
  }
}
