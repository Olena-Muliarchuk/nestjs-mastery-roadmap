import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateSongInput } from './create-song.input';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateSongInput extends PartialType(CreateSongInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
