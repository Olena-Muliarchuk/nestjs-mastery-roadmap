import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { UpdateSongDto } from './dto/update-song.dto';
import { User } from '../auth/decorators/user.decorator';
import { Role, type ActiveUser } from '@app/contracts';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FilterSongDto } from './dto/filter-song.dto';
import { Auth } from '@app/nest-zero-to-hero/auth/decorators/auth.decorator';
import { CacheTTL } from '@nestjs/cache-manager';
import { HttpCacheInterceptor } from '@app/nest-zero-to-hero/common/interceptors/http-cache.interceptor';
@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all songs with pagination' })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(60 * 1000)
  findAll(@Query() filterDto: FilterSongDto): Promise<Pagination<Song>> {
    const baseUrl = this.configService.get<string>('BASE_URL');

    return this.songsService.paginate(
      {
        page: filterDto.page,
        limit: filterDto.limit > 100 ? 100 : filterDto.limit,
        route: `${baseUrl}/songs`,
      },
      filterDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new song' })
  @Auth()
  create(@Body() createSongDto: CreateSongDto, @User() user: ActiveUser): Promise<Song> {
    console.log(user);
    return this.songsService.create(createSongDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a song' })
  @Auth(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song (Admin only)' })
  @Auth(Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.delete(id);
  }
}
