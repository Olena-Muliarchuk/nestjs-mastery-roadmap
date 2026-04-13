import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role } from '@app/contracts';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Auth } from '@app/nest-zero-to-hero/auth/decorators/auth.decorator';
import { StorageService } from '@app/nest-zero-to-hero/storage/storage.service';

@ApiTags('admin')
@Controller('admin')
@Auth(Role.Admin)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly storageService: StorageService,
  ) {}

  @Patch('promote/:id')
  @ApiOperation({ summary: 'Promote user to admin' })
  async promote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.promoteToAdmin(id);
  }

  @Patch('demote/:id')
  @ApiOperation({ summary: 'Demote admin to user' })
  async demote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.demoteToUser(id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload mp3 file or cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'audio/mpeg', // mp3
          'audio/wav',
          'image/jpeg', // jpg, jpeg
          'image/png',
          'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Only audio or image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not uploaded');
    }

    const folder = file.mimetype.startsWith('image/') ? 'images' : 'songs';

    const savedFileKey = await this.storageService.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
      folder,
    );

    return {
      message: 'File uploaded successfully to cloud storage',
      fileKey: savedFileKey,
    };
  }
}
