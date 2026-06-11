import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { SongType } from './models/song.type';
import { CreateSongInput } from './inputs/create-song.input';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => SongType)
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Query(() => SongType, { name: 'song', nullable: true })
  async getSong(@Args('id', { type: () => Int }) id: number) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return this.songsService.findOne(id);
  }

  @Mutation(() => SongType)
  async createSong(@Args('createSongInput') createSongInput: CreateSongInput) {
    const MOCK_USER_ID = 1;

    const createSongDto = {
      ...createSongInput,
      releasedDate: createSongInput.releasedDate.toISOString(),
    };

    return this.songsService.create(createSongDto, MOCK_USER_ID);
  }

  @Mutation(() => Boolean)
  async deleteSong(@Args('id', { type: () => Int }) id: number) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    await this.songsService.delete(id);
    return true;
  }
}
