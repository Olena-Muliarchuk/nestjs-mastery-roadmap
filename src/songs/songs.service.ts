import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(songDto: CreateSongDto): Promise<Song> {
    const { artist, ...rest } = songDto;

    const song = this.songRepository.create({
      ...rest,
      artist: { id: artist } as Artist,
    });

    return await this.songRepository.save(song);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    return paginate<Song>(this.songRepository, options, {
      relations: ['artist'],
    });
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!song) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    return song;
  }

  async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    if (Object.keys(recordToUpdate).length === 0) {
      throw new HttpException('Provide at least one field to update', HttpStatus.BAD_REQUEST);
    }

    const { artist, releasedDate, ...rest } = recordToUpdate;

    const updateData = {
      ...rest,
      ...(artist ? { artist: { id: artist } as Artist } : {}),
      ...(releasedDate ? { releasedDate: new Date(releasedDate) } : {}),
    };
    const result = await this.songRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async delete(id: number): Promise<DeleteResult> {
    const result = await this.songRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
