import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ArtistsType } from '../../artists/models/artists.type';

@ObjectType('Song')
export class SongType {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  lyrics?: string;

  @Field(() => [ArtistsType], { nullable: true })
  artists?: ArtistsType[];
}
