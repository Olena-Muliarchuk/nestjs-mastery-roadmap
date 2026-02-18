import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log('Mimetype is:', file.mimetype);

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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not uploaded');
    }

    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
