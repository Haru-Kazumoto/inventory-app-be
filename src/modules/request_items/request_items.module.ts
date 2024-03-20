import { Module } from '@nestjs/common';
import { RequestItemsService } from './request_items.service';
import { RequestItemsController } from './request_items.controller';
import { RequestItemsRepository } from './repository/request_items.repository';
import { RequestItem } from './entities/request_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassModule } from '../class/class.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestItem]),
    ClassModule,
    NotificationModule,
    AuthModule,
    UserModule
  ],
  controllers: [RequestItemsController],
  providers: [RequestItemsService, RequestItemsRepository],
  exports: [RequestItemsService, RequestItemsRepository],
})
export class RequestItemsModule {}
