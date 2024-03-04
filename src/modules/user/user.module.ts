import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { Roles } from 'src/security/decorator/roles.decorator';
import { RoleModule } from '../role/role.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationModule),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ResponseHttp,
    UserRepository,
    UserUtils,
    {
      provide: 'USER_SERVICE',
      useClass: UserService
    }
  ],
  exports: [
    UserUtils,
    UserRepository,
    UserService,
    {
      provide: 'USER_SERVICE',
      useClass: UserService
    }
  ]
})
export class UserModule {}
