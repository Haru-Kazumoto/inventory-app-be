import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { Roles } from 'src/security/decorator/roles.decorator';
import { RoleModule } from '../role/role.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    RoleModule,
    NotificationModule
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
    UserService,
    UserUtils,
    UserRepository,
    {
      provide: 'USER_SERVICE',
      useClass: UserService
    }
  ]
})
export class UserModule {}
