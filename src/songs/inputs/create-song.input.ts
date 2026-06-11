import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateSongInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  url?: string;

  @Field()
  @IsDate()
  @Type(() => Date)
  releasedDate!: Date;

  @Field(() => [Int])
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  artists!: number[];

  // add fields for cimpability with CreateSongDto
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  duration?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lyrics?: string;
}
