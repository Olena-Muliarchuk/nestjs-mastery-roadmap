import { IsString, IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';

export class CreateSongDto {
  @IsString({ message: 'Name is string' })
  @IsNotEmpty()
  readonly title: string;

  @IsInt()
  @IsNotEmpty()
  readonly artist: number;

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: string;

  @IsInt()
  @Min(1)
  readonly duration: number; // Duration in seconds
}
