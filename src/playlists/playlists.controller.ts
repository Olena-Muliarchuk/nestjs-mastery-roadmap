import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';
import type { ActiveUser } from '../auth/interfaces/active-user.interface';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @User() user: ActiveUser,
  ): Promise<Playlist> {
    return this.playlistsService.create(createPlaylistDto, user);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Playlist>> {
    return this.playlistsService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Playlist> {
    return this.playlistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.playlistsService.remove(id);
  }
}
