import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { LocalStrategy } from '../../security/local.strategy';
import { SessionSerializer } from '../../security/session.serializer';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { RoleRepository } from '../role/repository/role.repository';
import { NotificationModule } from '../notification/notification.module';

@Module(
    {
        imports: [
            TypeOrmModule.forFeature([User]),
            UserModule,
            forwardRef(() => NotificationModule),
            RoleModule
        ],
        providers: [
            AuthService,
            UserService,
            UserRepository,
            LocalStrategy,
            SessionSerializer,
            RoleRepository
        ],
        controllers: [AuthController],
        exports: [
            AuthService
        ]
    }
)
export class AuthModule {}
