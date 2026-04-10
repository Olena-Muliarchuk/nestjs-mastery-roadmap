import { Test, TestingModule } from '@nestjs/testing';
import { AudioProcessor } from './audio.processor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song, SongStatus } from '../songs/song.entity';
import { StorageService } from '../storage/storage.service';
import { EventsGateway } from '../events/events.gateway';
import * as mm from 'music-metadata';
import { Readable } from 'stream';
import { AudioJobDto } from './interfaces/audio-job.interface';
import { Job } from 'bullmq';

jest.mock('music-metadata');

describe('AudioProcessor', () => {
  let processor: AudioProcessor;

  const mockSongRepository = {
    update: jest.fn(),
  };

  const mockStorageService = {
    getFileStream: jest.fn(),
  };

  const mockEventsGateway = {
    emitToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioProcessor,
        { provide: getRepositoryToken(Song), useValue: mockSongRepository },
        { provide: StorageService, useValue: mockStorageService },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    processor = module.get<AudioProcessor>(AudioProcessor);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process - extract-metadata', () => {
    it('should extract metadata, update DB, and emit success event', async () => {
      const mockJob = {
        id: 'job-1',
        name: 'extract-metadata',
        data: { songId: 1, storageKey: 'test.mp3', userId: 99 },
      } as unknown as Job<AudioJobDto>;

      const destroyMock = jest.fn();
      const onMock = jest.fn();

      const mockStream = {
        on: onMock,
        destroy: destroyMock,
        destroyed: false,
      } as unknown as Readable;

      mockStorageService.getFileStream.mockResolvedValue(mockStream);

      (mm.parseStream as jest.Mock).mockResolvedValue({
        format: { duration: 125 },
      });

      await processor.process(mockJob);

      expect(mockSongRepository.update).toHaveBeenCalledWith(1, {
        duration: '00:02:05',
        status: SongStatus.ACTIVE,
      });

      expect(mockEventsGateway.emitToUser).toHaveBeenCalledWith(
        '99',
        'songReady',
        expect.objectContaining({ songId: 1, duration: '00:02:05', status: SongStatus.ACTIVE }),
      );

      expect(destroyMock).toHaveBeenCalled();
    });

    it('should handle errors, set status to FAILED, and STILL destroy the stream', async () => {
      const mockJob = {
        id: 'job-2',
        name: 'extract-metadata',
        data: { songId: 2, storageKey: 'broken.mp3', userId: 99 },
      } as unknown as Job<AudioJobDto>;

      const destroyMock = jest.fn();
      const onMock = jest.fn();

      const mockStream = {
        on: onMock,
        destroy: destroyMock,
        destroyed: false,
      } as unknown as Readable;

      mockStorageService.getFileStream.mockResolvedValue(mockStream);

      (mm.parseStream as jest.Mock).mockRejectedValue(new Error('Corrupted File'));

      await expect(processor.process(mockJob)).rejects.toThrow('Corrupted File');

      expect(mockSongRepository.update).toHaveBeenCalledWith(2, {
        status: SongStatus.FAILED,
      });

      expect(mockEventsGateway.emitToUser).toHaveBeenCalledWith(
        '99',
        'songFailed',
        expect.objectContaining({ songId: 2 }),
      );
      expect(destroyMock).toHaveBeenCalled();
    });
  });
});
