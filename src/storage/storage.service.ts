import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const PRESIGNED_URL_EXPIRES_IN = 60 * 15; // 15 minutes

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
      endpoint: this.configService.getOrThrow<string>('AWS_S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
      // Required for MinIO — uses path-style URLs instead of subdomain-style
      forcePathStyle: true,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Bucket "${this.bucketName}" already exists.`);
    } catch (error: unknown) {
      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) {
        await this.createBucket();
      } else {
        this.logger.error(`Cannot connect to storage. Check endpoint and credentials.`, error);
        throw error;
      }
    }
  }

  private async createBucket(): Promise<void> {
    this.logger.log(`Bucket "${this.bucketName}" not found. Creating...`);
    await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
    this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
  }

  async uploadFile(
    originalFileName: string,
    fileBuffer: Buffer,
    mimetype: string,
    folder: 'songs' | 'images' = 'songs',
  ): Promise<string> {
    // Generate a unique key to prevent collisions between files with the same name
    const key = `${folder}/${Date.now()}-${randomUUID()}-${originalFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype, // e.g. audio/mpeg, image/jpeg
    });

    await this.s3Client.send(command);

    this.logger.log(`File uploaded: ${key}`);

    return key;
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRES_IN,
    });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
    this.logger.log(`File deleted from storage: ${key}`);
  }
}
