import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { ConfigService } from '@nestjs/config';
import { CreateArtistDto } from './dto/create-artist.dto';

describe('ArtistsController', () => {
  let controller: ArtistsController;
  let service: ArtistsService;

  const mockArtistsService = {
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    paginate: jest.fn().mockResolvedValue({
      items: [],
      meta: {},
    }),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockConfigService = {
    get: jest.fn(() => 'http://localhost_test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        { provide: ArtistsService, useValue: mockArtistsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create artist', async () => {
    const dto: CreateArtistDto = { name: 'New Artist' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should find all (paginate)', async () => {
    await controller.findAll(1, 10);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.paginate).toHaveBeenCalled();
  });

  it('should find one', async () => {
    await controller.findOne(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update', async () => {
    await controller.update(1, { name: 'Updated' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalled();
  });

  it('should remove', async () => {
    await controller.remove(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
