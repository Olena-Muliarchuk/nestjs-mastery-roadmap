import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { Repository } from 'typeorm';
import { ActiveUser } from '@app/contracts';
import { Request } from 'express';

@Injectable()
export class PlaylistOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: ActiveUser }>();

    const user: ActiveUser = request.user;
    if (!user) {
      return false;
    }
    const playlistId = request.params.id;

    if (!playlistId || isNaN(+playlistId)) {
      throw new NotFoundException('Playlist ID is invalid');
    }

    const playlist = await this.playlistRepository.findOne({
      where: { id: +playlistId },
      relations: ['user'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.user?.id !== user.userId) {
      throw new ForbiddenException('You are not the owner of this playlist');
    }

    return true;
  }
}
