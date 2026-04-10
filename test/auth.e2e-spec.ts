import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { StorageService } from './../src/storage/storage.service';
import { Reflector } from '@nestjs/core';
import { Server } from 'http';

describe('Authentication Flow (e2e)', () => {
  let httpServer: Server;
  let app: INestApplication;
  let accessToken: string;

  const testEmail = `e2e_user_${Date.now()}@mail.com`;
  const testPassword = 'SuperSecretPassword123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue({
        onModuleInit: jest.fn(),
        uploadFile: jest.fn(),
        getPresignedUrl: jest.fn(),
        deleteFile: jest.fn(),
        getFileStream: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - should register a new user', () => {
    return request(httpServer)
      .post('/users')
      .send({
        name: 'E2E Test User',
        email: testEmail,
        password: testPassword,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual(testEmail);
        expect(res.body.password).toBeUndefined();
      });
  });

  it('/auth/login (POST) - should login and return tokens', () => {
    return request(httpServer)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();

        const body = res.body as { accessToken: string; refreshToken: string };
        accessToken = body.accessToken;
      });
  });

  it('/auth/profile (GET) - should access protected route with token', () => {
    return request(httpServer)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual(testEmail);
      });
  });

  it('/auth/profile (GET) - should fail without token', () => {
    return request(httpServer).get('/auth/profile').expect(401);
  });
});
