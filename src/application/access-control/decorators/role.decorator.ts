import { SetMetadata } from '@nestjs/common';
import { Role } from '../access-control.constant';

export const ROLE_KEY = 'role';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);