import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { ConfigService } from '@nestjs/config';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  const mockSongsService = {
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    paginate: jest.fn().mockResolvedValue({
      items: [{ id: 1, title: 'Test' }],
      meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    }),
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Song' }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'BASE_URL') return 'http://localhost_test';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: mockSongsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- TESTS ---

  it('should get all songs with pagination', async () => {
    const result = await controller.findAll(1, 10);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.paginate).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost_test/songs',
    });

    expect(result.items).toEqual([{ id: 1, title: 'Test' }]);
  });

  it('should get one song by id', async () => {
    const result = await controller.findOne(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, title: 'Test Song' });
  });

  it('should create a song', async () => {
    const dto: CreateSongDto = {
      title: 'T',
      artist: 1,
      duration: 100,
      releasedDate: '2022-01-01',
    };
    const result = await controller.create(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should update a song', async () => {
    const dto: UpdateSongDto = { title: 'Updated' };
    const result = await controller.update(1, dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a song', async () => {
    const result = await controller.delete(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
