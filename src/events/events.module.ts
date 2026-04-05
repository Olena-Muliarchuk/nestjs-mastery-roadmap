import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [EventsGateway],
  imports: [AuthModule],
})
export class EventsModule {}
