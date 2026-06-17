import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SortOrder } from '../dto/filter-song.dto';
import { PaginationArgs } from '../../common/args/pagination.args';

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@ArgsType()
export class FilterSongArgs extends PaginationArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  artist?: string;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
