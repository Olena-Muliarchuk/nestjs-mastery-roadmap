import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { BullModule } from '@nestjs/bullmq';
import { AudioProcessor } from './audio.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-queue',
    }),
  ],
  providers: [AudioService, AudioProcessor],
  exports: [AudioService],
})
export class AudioModule {}
