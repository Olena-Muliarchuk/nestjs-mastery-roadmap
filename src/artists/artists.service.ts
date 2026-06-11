import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, In } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  findAll() {
    return `This action returns all artists`;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Artist>> {
    return paginate<Artist>(this.artistRepository, options);
  }

  async findOne(id: number): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async update(id: number, recordToUpdate: UpdateArtistDto): Promise<UpdateResult> {
    if (Object.keys(recordToUpdate).length === 0) {
      throw new HttpException('Provide at least one field to update', HttpStatus.BAD_REQUEST);
    }
    const result = await this.artistRepository.update(id, recordToUpdate);

    if (result.affected === 0) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findByIds(ids: number[]): Promise<Artist[]> {
    return this.artistRepository.findBy({ id: In(ids) });
  }

  async findArtistsBySongIds(songIds: number[]): Promise<Map<number, Artist[]>> {
    const songs = await this.artistRepository
      .createQueryBuilder('artist')
      .innerJoinAndSelect('artist.songs', 'song')
      .where('song.id IN (:...songIds)', { songIds })
      .getMany();

    const map = new Map<number, Artist[]>();

    for (const songId of songIds) {
      map.set(songId, []);
    }

    for (const artist of songs) {
      for (const song of artist.songs) {
        if (map.has(song.id)) {
          map.get(song.id)!.push(artist);
        }
      }
    }

    return map;
  }
}
