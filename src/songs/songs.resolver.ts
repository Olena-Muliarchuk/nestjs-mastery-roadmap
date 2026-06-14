import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongType } from './models/song.type';
import { CreateSongInput } from './inputs/create-song.input';
import { UpdateSongInput } from './inputs/update-song.input';
import { ArtistsType } from 'src/artists/models/artists.type';
import { Song } from './song.entity';
import { ArtistsLoader } from './loaders/artists.loader';

import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import type { ActiveUser } from '../auth/interfaces/active-user.interface';
import { Role } from '../auth/enums/role.enum';
import { PaginatedSongsType } from './models/paginated-songs.type';
import { FilterSongArgs } from './args/filter-song.args';

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

  @Query(() => PaginatedSongsType, { name: 'songs' })
  async getSongs(@Args() filterSongArgs: FilterSongArgs) {
    const { page, limit } = filterSongArgs;

    return this.songsService.paginate(
      {
        page,
        limit,
        route: '',
      },
      filterSongArgs,
    );
  }

  @Mutation(() => SongType)
  @Auth()
  async createSong(
    @Args('createSongInput') createSongInput: CreateSongInput,
    @User() user: ActiveUser,
  ) {
    const createSongDto = {
      ...createSongInput,
      releasedDate: createSongInput.releasedDate.toISOString(),
    };

    return await this.songsService.create(createSongDto, user.userId);
  }

  @Mutation(() => Boolean)
  @Auth(Role.Admin)
  async deleteSong(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    await this.songsService.delete(id);
    return true;
  }

  @Mutation(() => SongType)
  @Auth(Role.Admin)
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
