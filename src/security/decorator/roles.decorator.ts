import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from 'src/utils/constant';

export const Roles = (...roles: string[]) => SetMetadata(ROLE_KEY, roles);
