import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessPaths } from './roles.access.entity';
import { Roles } from '../role/roles.entity';
import { AccessRolesRepository } from './roles.access.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AccessPaths, Roles])],
    providers: [AccessRolesRepository],
    exports: [AccessRolesRepository]
})
export class RolesAccessModule {}
