import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repository/role.repository';
import { ResponseHttp } from '../../utils/response.http.utils';

@Module({
    imports: [
        TypeOrmModule.forFeature([Roles]),
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
        ResponseHttp,
    ],
    exports: [
        RoleRepository,
        RoleService
    ]
})
export class RoleModule {}
