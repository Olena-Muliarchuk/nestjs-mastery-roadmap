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
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { UpdateSongDto } from './dto/update-song.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import type { ActiveUser } from '../auth/interfaces/active-user.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FilterSongDto } from './dto/filter-song.dto';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all songs with pagination' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new song' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createSongDto: CreateSongDto, @User() user: ActiveUser): Promise<Song> {
    console.log(user);
    return this.songsService.create(createSongDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a song' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a song (Admin only)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.delete(id);
  }
}
