import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { BullModule } from '@nestjs/bullmq';
import { AudioProcessor } from './audio.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '@app/nest-zero-to-hero/songs/song.entity';
import { StorageModule } from '@app/nest-zero-to-hero/storage/storage.module';
import { EventsModule } from '@app/nest-zero-to-hero/events/events.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-queue',
    }),
    TypeOrmModule.forFeature([Song]),
    StorageModule,
    EventsModule,
  ],
  providers: [AudioService, AudioProcessor],
  exports: [AudioService],
})
export class AudioModule {}
