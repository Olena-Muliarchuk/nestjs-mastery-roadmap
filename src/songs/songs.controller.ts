import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  DefaultValuePipe,
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
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createSongDto: CreateSongDto, @User() user: any): Promise<Song> {
    console.log(user);
    return this.songsService.create(createSongDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.delete(id);
  }
}
