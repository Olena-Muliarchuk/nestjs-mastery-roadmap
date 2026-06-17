import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  itemCount!: number;

  @Field(() => Int)
  totalItems!: number;

  @Field(() => Int)
  itemsPerPage!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => Int)
  currentPage!: number;
}
