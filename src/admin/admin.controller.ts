import { Controller, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('promote/:id')
  async promote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.promoteToAdmin(id);
  }

  @Patch('demote/:id')
  async demote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.demoteToUser(id);
  }
}
