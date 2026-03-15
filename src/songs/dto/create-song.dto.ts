import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsString({ message: 'Name is string' })
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  readonly artists: number[];

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: string;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: string;

  @IsString()
  @IsOptional()
  readonly lyrics: string;

  @IsString()
  @IsOptional()
  readonly url: string;

  @IsString()
  @IsOptional()
  readonly storageKey?: string;
}
