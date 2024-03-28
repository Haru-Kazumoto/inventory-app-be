import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repository/role.repository';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Roles]),
        forwardRef(() => UserModule),
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
    ],
    exports: [
        RoleRepository,
        RoleService
    ]
})
export class RoleModule {}
