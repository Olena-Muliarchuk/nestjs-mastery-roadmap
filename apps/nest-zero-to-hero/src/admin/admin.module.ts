import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '@app/nest-zero-to-hero/users/users.module';
import { StorageModule } from '@app/nest-zero-to-hero/storage/storage.module';

@Module({
  imports: [UsersModule, StorageModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
