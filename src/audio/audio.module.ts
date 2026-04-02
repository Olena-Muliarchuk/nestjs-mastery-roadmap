import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { BullModule } from '@nestjs/bullmq';
import { AudioProcessor } from './audio.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-queue',
    }),
    TypeOrmModule.forFeature([Song]),
    StorageModule,
  ],
  providers: [AudioService, AudioProcessor],
  exports: [AudioService],
})
export class AudioModule {}
