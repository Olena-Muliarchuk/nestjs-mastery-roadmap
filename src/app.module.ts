import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [TasksModule, SongsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
