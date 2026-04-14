import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern({ cmd: 'ping' })
  pingCheck() {
    console.log('Received ping via TCP!');
    return { message: 'Pong from nest-zero-to-hero (TCP)', timestamp: new Date() };
  }
}
