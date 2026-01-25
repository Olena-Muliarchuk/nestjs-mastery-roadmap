import { Injectable } from '@nestjs/common';
import { Song } from './interfaces/song.interface';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongsService {
  private songs: Song[] = [];

  create(songDto: CreateSongDto): Song {
    const song: Song = {
      ...songDto,
      releasedDate: new Date(songDto.releasedDate),
    };

    this.songs.push(song);
    return song;
  }

  getAllSongs(): Song[] {
    return this.songs;
  }
}
