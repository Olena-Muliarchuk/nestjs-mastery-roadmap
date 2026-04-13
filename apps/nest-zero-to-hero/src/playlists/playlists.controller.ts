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
import { User } from '../auth/decorators/user.decorator';
import type { ActiveUser } from '@app/contracts';
import { PlaylistOwnerGuard } from './guards/playlist-owner.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Auth } from '@app/nest-zero-to-hero/auth/decorators/auth.decorator';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new playlist' })
  @Auth()
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @User() user: ActiveUser,
  ): Promise<Playlist> {
    return this.playlistsService.create(createPlaylistDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all playlists with pagination' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Playlist>> {
    return this.playlistsService.paginate({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a playlist by ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Playlist> {
    return this.playlistsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Update a playlist (owner only)' })
  @UseGuards(PlaylistOwnerGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Delete a playlist (owner only)' })
  @UseGuards(PlaylistOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.playlistsService.remove(id);
  }
}
