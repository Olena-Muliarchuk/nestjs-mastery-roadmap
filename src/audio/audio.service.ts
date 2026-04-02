import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AudioJobDto } from './interfaces/audio-job.interface';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(@InjectQueue('audio-queue') private readonly audioQueue: Queue) {}

  async addMetadataJob(payload: AudioJobDto): Promise<void> {
    this.logger.log(`[Producer] Adding job for song ID: ${payload.songId} to queue...`);

    await this.audioQueue.add('extract-metadata', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000, // 1s -> 2s -> 4s
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    });
  }
}
