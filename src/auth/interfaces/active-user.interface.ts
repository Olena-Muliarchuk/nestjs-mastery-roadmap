import { Role } from '../enums/role.enum';

export interface ActiveUser {
  userId: number;
  email: string;
  role: Role;
}
