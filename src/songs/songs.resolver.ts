import { Resolver, Query, Mutation, Args, Int, ResolveField, Root } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { SongType } from './models/song.type';
import { CreateSongInput } from './inputs/create-song.input';
import { BadRequestException } from '@nestjs/common';
import { UpdateSongInput } from './inputs/update-song.input';
import { ArtistsType } from 'src/artists/models/artists.type';
import { Song } from './song.entity';

@Resolver(() => SongType)
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Query(() => SongType, { name: 'song', nullable: true })
  async getSong(@Args('id', { type: () => Int }) id: number) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.songsService.findOne(id);
  }

  @Mutation(() => SongType)
  async createSong(@Args('createSongInput') createSongInput: CreateSongInput) {
    const MOCK_USER_ID = 1;

    const createSongDto = {
      ...createSongInput,
      releasedDate: createSongInput.releasedDate.toISOString(),
    };

    return await this.songsService.create(createSongDto, MOCK_USER_ID);
  }

  @Mutation(() => Boolean)
  async deleteSong(@Args('id', { type: () => Int }) id: number) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    await this.songsService.delete(id);
    return true;
  }

  @Mutation(() => SongType)
  async updateSong(@Args('updateSongInput') updateSongInput: UpdateSongInput) {
    const { id, releasedDate, ...edits } = updateSongInput;

    const updateSongDto = {
      ...edits,
      ...(releasedDate && { releasedDate: releasedDate.toISOString() }),
    };

    await this.songsService.update(id, updateSongDto);

    return await this.songsService.findOne(id);
  }

  @ResolveField(() => [ArtistsType])
  async artists(@Root() song: Song) {
    return await this.songsService.findArtistsBySongId(song.id);
  }
}
