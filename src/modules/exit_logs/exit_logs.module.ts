import { Module, forwardRef } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { ExitLogsController } from './exit_logs.controller';
import { ExitLogsRepository } from './repositories/exit_logs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExitLogs } from './entities/exit_logs.entity';
import { ItemDetails } from '../item_details/entities/item_details.entity';
import { ItemDetailsModule } from '../item_details/item_details.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExitLogs,ItemDetails]),
    ItemDetailsModule,
    ItemsModule,
  ],
  controllers: [ExitLogsController],
  providers: [ExitLogsService,ExitLogsRepository],
  exports: [ExitLogsService, ExitLogsRepository]
})
export class ExitLogsModule {}