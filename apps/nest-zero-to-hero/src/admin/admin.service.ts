import { Injectable } from '@nestjs/common';
import { Role } from '@app/contracts';
import { UsersService } from '@app/nest-zero-to-hero/users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UsersService) {}

  async promoteToAdmin(id: number) {
    return this.userService.updateRole(id, Role.Admin);
  }

  async demoteToUser(id: number) {
    return this.userService.updateRole(id, Role.User);
  }
}
