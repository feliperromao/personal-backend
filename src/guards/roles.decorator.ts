import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from '@src/users/enum/user.type';

export const ROLES_KEY = 'type';
export const Roles = (...roles: USER_TYPE[]) => SetMetadata(ROLES_KEY, roles);