import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActiveUser } from '@app/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<ActiveUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const passwordToCompare =
      user?.password ?? '$2b$10$invalidhashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const isPasswordValid = await bcrypt.compare(pass, passwordToCompare);

    if (!isPasswordValid) return null;

    return { userId: user.id, email: user.email, role: user.role };
  }

  public async login(user: ActiveUser) {
    const tokens = await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateHashedRefreshToken(user.userId, hashedRefreshToken);

    return {
      ...tokens,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async generateTokens(user: ActiveUser) {
    const payload = { sub: user.userId, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        payload,
        this.configService.getOrThrow('JWT_SECRET'),
        this.configService.getOrThrow('JWT_EXPIRATION'),
      ),
      this.signToken(
        payload,
        this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        this.configService.getOrThrow('JWT_REFRESH_EXPIRATION'),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken(payload: object, secret: string, expiresIn: string) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  async refreshTokens(user: ActiveUser) {
    const userEntity = await this.usersService.findOne(user.userId);
    if (!userEntity || !userEntity.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }
    const refreshToken = user.refreshToken;
    const refreshTokenMatches = await bcrypt.compare(refreshToken, userEntity.hashedRefreshToken);

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens({
      userId: userEntity.id,
      email: userEntity.email,
      role: userEntity.role,
    });

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateHashedRefreshToken(user.userId, hashedRefreshToken);

    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.updateHashedRefreshToken(userId, null);
  }
}
