import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { SongType } from './models/song.type';

@Resolver(() => SongType)
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Query(() => SongType, { name: 'song', nullable: true })
  async getSong(@Args('id', { type: () => Int }) id: number) {
    if (id <= 0) {
      throw new Error('ID must be a positive integer');
    }
    return this.songsService.findOne(id);
  }
}
