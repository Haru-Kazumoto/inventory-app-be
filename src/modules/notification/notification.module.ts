import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { NotificationRepository } from './repository/notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    UserModule
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService]
})
export class NotificationModule {}
