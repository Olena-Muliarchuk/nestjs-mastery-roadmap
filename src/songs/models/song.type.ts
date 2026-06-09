import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('Song')
export class SongType {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  url?: string;
}
