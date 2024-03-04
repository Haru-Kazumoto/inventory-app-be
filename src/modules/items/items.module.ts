import { Module, forwardRef } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './repository/items.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Class } from '../class/entitites/class.entity';
import { ClassModule } from '../class/class.module';
import { NotificationModule } from '../notification/notification.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Class]),
    ClassModule,
    NotificationModule,
    AuthModule,
    forwardRef(() => AuditLogsModule)
  ],
  controllers: [
    ItemsController
  ],
  providers: [
    ItemsService, 
    ItemsRepository
  ],
  exports: [
    ItemsService, 
    ItemsRepository
  ]
})
export class ItemsModule {}
