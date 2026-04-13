import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '@app/nest-zero-to-hero/auth/auth.module';

@Module({
  providers: [EventsGateway],
  imports: [AuthModule],
  exports: [EventsGateway],
})
export class EventsModule {}
