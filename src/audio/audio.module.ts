import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-queue',
    }),
  ],
  providers: [AudioService],
})
export class AudioModule {}
