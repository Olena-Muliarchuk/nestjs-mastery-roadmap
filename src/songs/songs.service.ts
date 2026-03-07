import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult, In } from 'typeorm';
import { Song } from './song.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { FilterSongDto } from './dto/filter-song.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(songDto: CreateSongDto): Promise<Song> {
    const artists = await this.artistRepository.findBy({
      id: In(songDto.artists),
    });

    const song = this.songRepository.create({
      ...songDto,
      artists: artists,
    });

    const saved = await this.songRepository.save(song);

    await this.invalidateSongsCache();

    return saved;
  }

  async paginate(options: IPaginationOptions, filterDto: FilterSongDto): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('song');

    // 'song.artists' - name field in  song.entity.ts, 'artist' - alias for table
    queryBuilder.leftJoinAndSelect('song.artists', 'artist');

    if (filterDto.title) {
      queryBuilder.andWhere('song.title ILIKE :title', {
        title: `%${filterDto.title}%`,
      });
    }

    if (filterDto.artist) {
      queryBuilder.andWhere('artist.name ILIKE :artist', {
        artist: `%${filterDto.artist}%`,
      });
    }

    if (filterDto.sortOrder) {
      queryBuilder.orderBy('song.releasedDate', filterDto.sortOrder);
    }

    return paginate<Song>(queryBuilder, options);
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

    await this.invalidateSongsCache();

    return result;
  }

  async delete(id: number): Promise<DeleteResult> {
    const result = await this.songRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    await this.invalidateSongsCache();

    return result;
  }

  private async invalidateSongsCache(): Promise<void> {
    try {
      const store = this.cacheManager.stores[0] as {
        keys?: (pattern: string) => Promise<string[]>;
      };

      if (typeof store.keys === 'function') {
        const keys = await store.keys('api:/songs*');
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
        this.logger.log(`Invalidated ${keys.length} cache keys`);
      } else {
        await this.cacheManager.clear();
        this.logger.log('Cache cleared (full)');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Cache invalidation failed: ${message}`);
    }
  }
}
