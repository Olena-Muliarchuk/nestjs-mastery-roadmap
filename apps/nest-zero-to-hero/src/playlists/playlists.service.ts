import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/entities/user.entity';
import { ActiveUser } from 'src/auth/interfaces/active-user.interface';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private dataSource: DataSource,
  ) {}

  async create(playlistDto: CreatePlaylistDto, user: ActiveUser): Promise<Playlist> {
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      let songs: Song[] = [];

      if (playlistDto.songs && playlistDto.songs.length > 0) {
        songs = await transactionalEntityManager.find(Song, {
          where: { id: In(playlistDto.songs) },
        });

        if (songs.length !== playlistDto.songs.length) {
          throw new NotFoundException('Some songs not found');
        }
      }

      const playlist = transactionalEntityManager.create(Playlist, {
        name: playlistDto.name,
        songs: songs,
        user: { id: user.userId } as User,
      });

      return await transactionalEntityManager.save(playlist);
    });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Playlist>> {
    return paginate<Playlist>(this.playlistRepository, options, {
      relations: ['songs', 'user'],
    });
  }

  async findAll(): Promise<Playlist[]> {
    return await this.playlistRepository.find({
      relations: ['songs', 'user'],
    });
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['songs', 'user'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['songs'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (updatePlaylistDto.name) {
      playlist.name = updatePlaylistDto.name;
    }

    if (updatePlaylistDto.songs) {
      const songs = await this.songRepository.find({
        where: { id: In(updatePlaylistDto.songs) },
      });

      if (songs.length !== updatePlaylistDto.songs.length) {
        throw new NotFoundException('Some songs not found');
      }

      playlist.songs = songs;
    }

    return await this.playlistRepository.save(playlist);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.playlistRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Playlist not found');
    }

    return result;
  }
}
