import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Artists')
export class ArtistsType {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;
}
