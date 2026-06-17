import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsString({ message: 'Name is string' })
  @IsNotEmpty()
  readonly name!: string;
}
