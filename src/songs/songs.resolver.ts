import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongType } from './models/song.type';
import { CreateSongInput } from './inputs/create-song.input';
import { UpdateSongInput } from './inputs/update-song.input';
import { ArtistsType } from 'src/artists/models/artists.type';
import { Song } from './song.entity';
import { ArtistsLoader } from './loaders/artists.loader';

@Resolver(() => SongType)
export class SongsResolver {
  constructor(
    private readonly songsService: SongsService,
    private readonly artistsLoader: ArtistsLoader,
  ) {}

  @Query(() => SongType, { name: 'song', nullable: true })
  async getSong(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
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
  async deleteSong(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
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
  async artists(@Parent() song: Song) {
    return this.artistsLoader.batchArtists.load(song.id);
  }
}
