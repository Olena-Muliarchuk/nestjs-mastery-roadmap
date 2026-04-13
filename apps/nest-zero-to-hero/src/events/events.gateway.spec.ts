import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket } from './types/socket.types';
import { Server } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  let toMock: jest.Mock;
  let emitMock: jest.Mock;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
  };

  const createMockSocket = (
    token: string | undefined,
    joinMock: jest.Mock,
    disconnectMock: jest.Mock,
  ): AuthenticatedSocket => {
    return {
      id: 'socket-123',
      handshake: {
        auth: { token },
        headers: {},
      } as unknown as AuthenticatedSocket['handshake'],
      data: {} as unknown as AuthenticatedSocket['data'],
      join: joinMock,
      disconnect: disconnectMock,
    } as unknown as AuthenticatedSocket;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);

    toMock = jest.fn().mockReturnThis();
    emitMock = jest.fn();

    gateway.server = {
      to: toMock,
      emit: emitMock,
    } as unknown as Server;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should authenticate user and join their personal room if token is valid', async () => {
      const joinMock = jest.fn();
      const disconnectMock = jest.fn();

      const mockSocket = createMockSocket('Bearer valid-token', joinMock, disconnectMock);

      mockJwtService.verifyAsync.mockResolvedValue({ sub: 99, email: 'test@mail.com' });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.data.user).toEqual({ sub: 99, email: 'test@mail.com' });

      expect(joinMock).toHaveBeenCalledWith('user:99');
      expect(disconnectMock).not.toHaveBeenCalled();
    });

    it('should disconnect client if no token is provided', async () => {
      const joinMock = jest.fn();
      const disconnectMock = jest.fn();

      const mockSocket = createMockSocket(undefined, joinMock, disconnectMock);

      await gateway.handleConnection(mockSocket);

      expect(disconnectMock).toHaveBeenCalledWith(true);
      expect(joinMock).not.toHaveBeenCalled();
    });

    it('should disconnect client if token is invalid (verification fails)', async () => {
      const joinMock = jest.fn();
      const disconnectMock = jest.fn();

      const mockSocket = createMockSocket('Bearer invalid-token', joinMock, disconnectMock);

      mockJwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await gateway.handleConnection(mockSocket);

      expect(disconnectMock).toHaveBeenCalledWith(true);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to specific user room', () => {
      const userId = '99';
      const eventName = 'songReady';
      const eventData = { songId: 1 };

      gateway.emitToUser(userId, eventName, eventData);

      expect(toMock).toHaveBeenCalledWith(`user:${userId}`);
      expect(emitMock).toHaveBeenCalledWith(eventName, eventData);
    });
  });
});
