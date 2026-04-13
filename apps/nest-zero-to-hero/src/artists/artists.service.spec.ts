import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';

describe('ArtistsService', () => {
  let service: ArtistsService;

  const mockArtistRepository = {
    create: jest.fn().mockImplementation((dto: CreateArtistDto) => dto),
    save: jest.fn().mockImplementation((artist) => Promise.resolve({ id: 1, ...artist })),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      if (id === 1) return Promise.resolve({ id: 1, name: 'Test Artist' });
      return Promise.resolve(null);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistsService,
        {
          provide: getRepositoryToken(Artist),
          useValue: mockArtistRepository,
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an artist', async () => {
      const dto: CreateArtistDto = { name: 'Test Artist' };
      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findOne', () => {
    it('should return an artist', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Test Artist' });
    });

    it('should throw 404 if not found', async () => {
      await expect(service.findOne(99)).rejects.toThrow(
        new HttpException('Artist not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update an artist', async () => {
      const result = await service.update(1, { name: 'Updated' });
      expect(result.affected).toBe(1);
    });

    it('should throw if body empty', async () => {
      await expect(service.update(1, {})).rejects.toThrow(
        new HttpException('Provide at least one field to update', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
