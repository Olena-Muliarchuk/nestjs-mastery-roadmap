import { Controller, Get, Inject } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('HERO_SERVICE') private readonly heroClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get('test-tcp')
  testTcpCommunication() {
    console.log('Send ping to monopolit through TCP...');
    return this.heroClient.send({ cmd: 'ping' }, {});
  }
}
