import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';

describe('SongsService', () => {
  let service: SongsService;

  const mockSongRepository = {
    create: jest.fn().mockImplementation((dto: CreateSongDto) => dto),

    save: jest.fn().mockImplementation((song: CreateSongDto) =>
      Promise.resolve({
        id: 1,
        ...song,
        releasedDate: song.releasedDate
          ? new Date(song.releasedDate)
          : undefined,
      }),
    ),

    find: jest.fn().mockResolvedValue([]),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new song', async () => {
    const dto: CreateSongDto = {
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 200,
      releasedDate: '2024-01-01',
    };

    const result = await service.create(dto);

    expect(result).toEqual({
      id: 1,
      ...dto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      releasedDate: expect.any(Date),
    });
  });
});
