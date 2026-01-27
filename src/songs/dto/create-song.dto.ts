import { IsString, IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';

export class CreateSongDto {
  @IsString({ message: 'Name is string' })
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly artist: string;

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: string;

  @IsInt()
  @Min(1)
  readonly duration: number; // Duration in seconds
}
