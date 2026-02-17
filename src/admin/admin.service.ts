import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { UsersService } from 'src/users/users.service';

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
