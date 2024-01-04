import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ResponseHttp } from 'src/utils/response.http.utils';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { Roles } from 'src/security/decorator/roles.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles])
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
