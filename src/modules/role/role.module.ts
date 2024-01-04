import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { AccessPaths } from '../access_roles/roles.access.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { RolesAccessModule } from '../access_roles/roles.access.module';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { AccessRolesRepository } from '../access_roles/roles.access.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Roles, AccessPaths]),
        RolesAccessModule
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
        ResponseHttp,
        AccessRolesRepository
    ],
    exports: [
        RoleRepository,
        RoleService
    ]
})
export class RoleModule {}
