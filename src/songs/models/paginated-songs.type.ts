import { ObjectType, Field } from '@nestjs/graphql';
import { SongType } from './song.type';
import { PaginationMeta } from '../../common/models/pagination-meta.type';

@ObjectType()
export class PaginatedSongsType {
  @Field(() => [SongType])
  items!: SongType[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}
