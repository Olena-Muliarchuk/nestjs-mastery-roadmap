import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AudioJobDto } from './interfaces/audio-job.interface';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  private readonly logger = new Logger(AudioProcessor.name);

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

    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.logger.log(`Metadata successfully extracted for song ${data.songId}!`);
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
