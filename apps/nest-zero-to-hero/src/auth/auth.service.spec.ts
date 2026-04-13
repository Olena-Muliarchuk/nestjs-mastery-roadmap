import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  findByEmail: jest.fn(),
  findOne: jest.fn(),
  updateHashedRefreshToken: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-access-secret';
    if (key === 'JWT_EXPIRATION') return '15m';
    if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
    if (key === 'JWT_REFRESH_EXPIRATION') return '7d';
    return null;
  }),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if email and password are valid', async () => {
      const plainPassword = 'mySuperPassword';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockDbUser = {
        id: 1,
        email: 'test@mail.com',
        password: hashedPassword,
        role: Role.User,
      };

      usersService.findByEmail.mockResolvedValue(mockDbUser);

      const result = await authService.validateUser('test@mail.com', plainPassword);

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@mail.com');
      expect(result).toEqual({
        userId: 1,
        email: 'test@mail.com',
        role: Role.User,
      });
    });
    it('should return null if user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser('notfound@mail.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);

      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: hashedPassword,
        role: Role.User,
      });

      const result = await authService.validateUser('test@mail.com', 'wrongPassword');

      expect(result).toBeNull();
    });
  });
  describe('login', () => {
    it('should generate tokens and update hashed refresh token in DB', async () => {
      const mockUser = {
        userId: 1,
        email: 'test@mail.com',
        role: Role.User,
      };

      mockJwtService.signAsync
        .mockResolvedValueOnce('fake-access-token')
        .mockResolvedValueOnce('fake-refresh-token');

      const result = await authService.login(mockUser);

      expect(result.accessToken).toBe('fake-access-token');
      expect(result.refreshToken).toBe('fake-refresh-token');
      expect(result.user.email).toBe('test@mail.com');

      expect(usersService.updateHashedRefreshToken).toHaveBeenCalledWith(1, expect.any(String));
    });
  });
  describe('refreshTokens', () => {
    it('should return new tokens if refresh token is valid', async () => {
      const plainRefreshToken = 'valid-refresh-token';
      const hashedRefreshToken = await bcrypt.hash(plainRefreshToken, 10);

      usersService.findOne.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        role: Role.User,
        hashedRefreshToken,
      });

      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await authService.refreshTokens({
        userId: 1,
        email: 'test@mail.com',
        role: Role.User,
        refreshToken: plainRefreshToken,
      });

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(usersService.updateHashedRefreshToken).toHaveBeenCalledWith(1, expect.any(String));
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      usersService.findOne.mockResolvedValue({
        id: 1,
        hashedRefreshToken: await bcrypt.hash('correct-token', 10),
      });

      await expect(
        authService.refreshTokens({
          userId: 1,
          email: 'test@mail.com',
          role: Role.User,
          refreshToken: 'wrong-hacker-token',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear hashed refresh token in DB', async () => {
      await authService.logout(99);
      expect(usersService.updateHashedRefreshToken).toHaveBeenCalledWith(99, null);
    });
  });
});
