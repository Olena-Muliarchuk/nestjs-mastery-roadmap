import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket } from './types/socket.types';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(_server: Server): void {
    this.logger.log('WebSocket Gateway initialized successfully!');
  }

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const authHeader =
        (client.handshake.auth.token as string | undefined) ??
        client.handshake.headers.authorization;

      if (!authHeader) {
        throw new Error('No token provided');
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      client.data.user = payload;

      await client.join(`user:${payload.sub}`);

      this.logger.log(`🟢 Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      this.logger.warn(`🔴 Unauthorized: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    const userId = client.data.user?.sub ?? 'unknown';
    this.logger.log(`⚪️ Client disconnected: ${client.id} (User: ${userId})`);
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
