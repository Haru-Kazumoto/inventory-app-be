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
import { ExcelService } from 'src/utils/excel/excel.service';
import { RequestItemsRepository } from '../request_items/repository/request_items.repository';
import { RequestItemsModule } from '../request_items/request_items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Class]),
    ClassModule,
    RequestItemsModule,
    NotificationModule,
    AuthModule,
    RequestItemsModule,
    forwardRef(() => AuditLogsModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository, ExcelService],
  exports: [ItemsService, ItemsRepository],
})
export class ItemsModule {}
