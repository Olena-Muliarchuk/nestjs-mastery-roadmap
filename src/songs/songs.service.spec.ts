import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SongsService', () => {
  let service: SongsService;

  const mockSongRepository = {
    create: jest.fn().mockImplementation((dto: CreateSongDto) => dto),
    save: jest.fn().mockImplementation((song: CreateSongDto) =>
      Promise.resolve({
        id: 1,
        ...song,
        releasedDate: song.releasedDate ? new Date(song.releasedDate) : undefined,
      }),
    ),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      if (id === 1) {
        return Promise.resolve({
          id: 1,
          title: 'Test Song',
          artist: 'Test Artist',
          duration: 180,
          releasedDate: '2022-01-01',
        });
      }
      return Promise.resolve(null);
    }),

    update: jest.fn().mockResolvedValue({ affected: 1 }),

    delete: jest.fn().mockResolvedValue({ affected: 1 }),

    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: mockSongRepository,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new song', async () => {
      const dto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        duration: 180,
        releasedDate: '2022-01-01',
      };

      const result = await service.create(dto);

      expect(mockSongRepository.create).toHaveBeenCalledWith(dto);
      expect(mockSongRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 1,
        ...dto,
        releasedDate: new Date(dto.releasedDate),
      });
    });
  });

  describe('findOne', () => {
    it('should find a song by id', async () => {
      const result = await service.findOne(1);

      expect(mockSongRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        id: 1,
        title: 'Test Song',
        artist: 'Test Artist',
        duration: 180,
        releasedDate: '2022-01-01',
      });
    });

    it('should throw 404 if song not found', async () => {
      await expect(service.findOne(99)).rejects.toThrow(
        new HttpException('Song not found', HttpStatus.NOT_FOUND),
      );

      expect(mockSongRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    });
  });

  describe('update', () => {
    it('should update a song successfully', async () => {
      const dto: UpdateSongDto = { title: 'Updated Title' };
      mockSongRepository.update.mockResolvedValueOnce({ affected: 1 });

      const result = await service.update(1, dto);

      expect(mockSongRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result.affected).toBe(1);
    });

    it('should throw BAD_REQUEST if body is empty', async () => {
      await expect(service.update(1, {})).rejects.toThrow(
        new HttpException('Provide at least one field to update', HttpStatus.BAD_REQUEST),
      );

      expect(mockSongRepository.update).not.toHaveBeenCalled();
    });

    it('should throw 404 if song to update not found', async () => {
      const dto: UpdateSongDto = { title: 'New Title' };
      mockSongRepository.update.mockResolvedValueOnce({ affected: 0 });

      await expect(service.update(99, dto)).rejects.toThrow(
        new HttpException('Song not found', HttpStatus.NOT_FOUND),
      );

      expect(mockSongRepository.update).toHaveBeenCalledWith(99, dto);
    });
  });

  describe('delete', () => {
    it('should delete a song successfully', async () => {
      mockSongRepository.delete.mockResolvedValueOnce({ affected: 1 });

      const result = await service.delete(1);

      expect(mockSongRepository.delete).toHaveBeenCalledWith(1);
      expect(result.affected).toBe(1);
    });

    it('should throw 404 if song to delete not found', async () => {
      mockSongRepository.delete.mockResolvedValueOnce({ affected: 0 });

      await expect(service.delete(99)).rejects.toThrow(
        new HttpException('Song not found', HttpStatus.NOT_FOUND),
      );

      expect(mockSongRepository.delete).toHaveBeenCalledWith(99);
    });
  });
});
