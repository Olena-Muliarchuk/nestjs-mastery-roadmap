import { Controller, Get, Post, Body, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;

    const baseUrl = this.configService.get<string>('BASE_URL');

    return this.songsService.paginate({
      page,
      limit,
      route: `${baseUrl}/songs`,
    });
  }

  @Post()
  create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }
}
