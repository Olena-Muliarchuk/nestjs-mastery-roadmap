import { ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaylistOwnerGuard } from './playlist-owner.guard';
import { Playlist } from '../entities/playlist.entity';

describe('PlaylistOwnerGuard', () => {
  let guard: PlaylistOwnerGuard;

  const mockPlaylistRepository = {
    findOne: jest.fn(),
  };

  const createMockContext = (userId: number, playlistId: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId },
          params: { id: playlistId },
        }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistOwnerGuard,
        {
          provide: getRepositoryToken(Playlist),
          useValue: mockPlaylistRepository,
        },
      ],
    }).compile();

    guard = module.get<PlaylistOwnerGuard>(PlaylistOwnerGuard);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user is the owner', async () => {
    const context = createMockContext(1, '10');

    mockPlaylistRepository.findOne.mockResolvedValue({
      id: 10,
      user: { id: 1 },
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is NOT the owner', async () => {
    const context = createMockContext(99, '10');

    mockPlaylistRepository.findOne.mockResolvedValue({
      id: 10,
      user: { id: 1 },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if playlist does not exist', async () => {
    const context = createMockContext(1, '999');
    mockPlaylistRepository.findOne.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if playlist ID is invalid (NaN)', async () => {
    const context = createMockContext(1, 'not-a-number');
    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });
});
