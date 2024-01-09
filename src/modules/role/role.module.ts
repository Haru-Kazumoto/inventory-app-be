import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { ResponseHttp } from 'src/utils/response.http.utils';

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
