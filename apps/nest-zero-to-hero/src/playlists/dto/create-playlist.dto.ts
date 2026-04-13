import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly songs: number[];
}
