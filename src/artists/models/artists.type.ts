import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Artists')
export class ArtistsType {
  @Field()
  name!: string;
}
