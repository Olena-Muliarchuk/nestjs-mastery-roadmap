import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterSongDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly artist?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  readonly page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  readonly limit: number = 10;
}
