import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  private songs: string[] = ['song 1', 'song 2', 'song 3'];

  getAllSongs(): string[] {
    return this.songs;
  }
}
