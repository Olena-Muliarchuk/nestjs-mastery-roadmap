import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from './playlists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from '../songs/song.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Role, ActiveUser } from '@app/contracts';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  const mockEntityManager = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (cb) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await cb(mockEntityManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        { provide: getRepositoryToken(Playlist), useValue: {} },
        { provide: getRepositoryToken(Song), useValue: {} },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (Transactions)', () => {
    const mockUser: ActiveUser = {
      userId: 1,
      email: 'test@mail.com',
      role: Role.User,
    };

    it('should create a playlist successfully when all songs exist', async () => {
      const dto: CreatePlaylistDto = { name: 'My Top Tracks', songs: [1, 2] };

      mockEntityManager.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const savedPlaylist = {
        id: 10,
        name: 'My Top Tracks',
        songs: [{ id: 1 }, { id: 2 }],
        user: { id: 1 },
      };
      mockEntityManager.create.mockReturnValue(savedPlaylist);
      mockEntityManager.save.mockResolvedValue(savedPlaylist);

      const result = await service.create(dto, mockUser);

      expect(result).toBeDefined();
      expect(result.name).toBe('My Top Tracks');
      expect(mockEntityManager.find).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException and abort transaction if a song is missing', async () => {
      const dto: CreatePlaylistDto = { name: 'My Top Tracks', songs: [1, 99] };

      mockEntityManager.find.mockResolvedValue([{ id: 1 }]);

      await expect(service.create(dto, mockUser)).rejects.toThrow(
        new NotFoundException('Some songs not found'),
      );

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });
  });
});
