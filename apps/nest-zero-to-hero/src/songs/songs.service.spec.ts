import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Artist } from '../artists/entities/artist.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { StorageService } from 'src/storage/storage.service';
import { AudioService } from 'src/audio/audio.service';

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
    findOne: jest.fn().mockImplementation((options: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const id = options.where.id;
      if (id === 1) {
        return Promise.resolve({
          id: 1,
          title: 'Test Song',
          artist: { id: 1, name: 'Test Artist' } as Artist,
          duration: 180,
          releasedDate: new Date('2022-01-01'),
        });
      }
      return Promise.resolve(null);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  const mockArtistRepository = {
    findBy: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Artist' }]),
  };

  const mockCacheManager = {
    stores: [{ keys: jest.fn().mockResolvedValue(['api:/songs']) }],
    del: jest.fn().mockResolvedValue(true),
    clear: jest.fn().mockResolvedValue(true),
  };

  const mockAudioService = {
    addMetadataJob: jest.fn().mockResolvedValue(undefined),
  };

  const mockStorageService = {
    deleteFile: jest.fn().mockResolvedValue(undefined),
    getPresignedUrl: jest.fn().mockResolvedValue('http://presigned.url/test.mp3'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        { provide: getRepositoryToken(Song), useValue: mockSongRepository },
        { provide: getRepositoryToken(Artist), useValue: mockArtistRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: StorageService, useValue: mockStorageService },
        { provide: AudioService, useValue: mockAudioService },
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
        artists: [1],
        duration: '03:00',
        releasedDate: '2022-01-01',
        lyrics: '',
        url: '',
      };

      const result = await service.create(dto, 1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe(dto.title);
    });
  });

  describe('findOne', () => {
    it('should find a song by id', async () => {
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('should throw 404 if song not found', async () => {
      await expect(service.findOne(99)).rejects.toThrow(
        new HttpException('Song not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a song successfully', async () => {
      const dto: UpdateSongDto = { title: 'Updated Title' };
      const result = await service.update(1, dto);
      expect(result.affected).toBe(1);
    });

    it('should throw BAD_REQUEST if body is empty', async () => {
      await expect(service.update(1, {})).rejects.toThrow(
        new HttpException('Provide at least one field to update', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('delete', () => {
    it('should delete a song successfully', async () => {
      const result = await service.delete(1);
      expect(result.affected).toBe(1);
    });
  });
});
