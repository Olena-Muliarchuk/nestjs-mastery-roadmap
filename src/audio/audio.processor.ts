import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AudioJobDto } from './interfaces/audio-job.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song, SongStatus } from 'src/songs/song.entity';
import { StorageService } from 'src/storage/storage.service';
import * as mm from 'music-metadata';
import { Readable } from 'stream';
import { EventsGateway } from 'src/events/events.gateway';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  private readonly logger = new Logger(AudioProcessor.name);

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly storageService: StorageService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super();
  }

  async process(job: Job<AudioJobDto>): Promise<void> {
    this.logger.log(`[Worker] Picked up job ${job.id} (${job.name})`);

    switch (job.name) {
      case 'extract-metadata':
        await this.handleMetadata(job.data);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
  private async handleMetadata(data: AudioJobDto): Promise<void> {
    this.logger.log(`Starting metadata extraction for song ${data.songId}...`);

    let stream: Readable | undefined;

    try {
      stream = await this.storageService.getFileStream(data.storageKey);

      stream.on('error', (err) => {
        this.logger.verbose(`Stream naturally aborted: ${err.message}`);
      });

      const metadata = await mm.parseStream(stream, undefined, {
        duration: true,
        skipPostHeaders: true,
      });

      const durationInSeconds = metadata.format.duration || 0;
      const formattedDuration = this.formatDuration(durationInSeconds);

      await this.songRepository.update(data.songId, {
        duration: formattedDuration,
        status: SongStatus.ACTIVE,
      });

      this.logger.log(`Metadata extracted for song ${data.songId}! Duration: ${formattedDuration}`);

      this.eventsGateway.emitToUser(data.userId.toString(), 'songReady', {
        songId: data.songId,
        duration: formattedDuration,
        status: SongStatus.ACTIVE,
        message: 'Your song is ready to play!',
      });
    } catch (error) {
      this.logger.error(`Failed to process song ${data.songId}`, error);

      await this.songRepository.update(data.songId, {
        status: SongStatus.FAILED,
      });

      this.eventsGateway.emitToUser(data.userId.toString(), 'songFailed', {
        songId: data.songId,
        message: 'Failed to process audio file.',
      });

      throw error;
    } finally {
      if (stream && !stream.destroyed) {
        stream.destroy();
        this.logger.debug(`Stream memory released for song ${data.songId}`);
      }
    }
  }

  private formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} fully completed!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
