import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(songDto: CreateSongDto): Promise<Song> {
    const song = this.songRepository.create(songDto);

    return await this.songRepository.save(song);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    return paginate<Song>(this.songRepository, options);
  }
}
