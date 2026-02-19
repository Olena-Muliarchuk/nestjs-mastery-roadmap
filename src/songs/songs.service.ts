import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult, In, ILike, FindManyOptions } from 'typeorm';
import { Song } from './song.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(songDto: CreateSongDto): Promise<Song> {
    const artists = await this.artistRepository.findBy({
      id: In(songDto.artists),
    });

    const song = this.songRepository.create({
      ...songDto,
      artists: artists,
    });

    return await this.songRepository.save(song);
  }

  async paginate(options: IPaginationOptions, title?: string): Promise<Pagination<Song>> {
    const searchOptions: FindManyOptions<Song> = {
      relations: ['artists'],
    };

    if (title) {
      searchOptions.where = [
        {
          title: ILike(`%${title}%`),
        },
      ];
    }

    return paginate<Song>(this.songRepository, options, searchOptions);
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['artists'],
    });
    if (!song) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    return song;
  }

  async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    const { artists: _artists, releasedDate, ...rest } = recordToUpdate;

    const updateData: Partial<Song> = { ...rest };

    if (releasedDate) {
      updateData.releasedDate = new Date(releasedDate);
    }

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
