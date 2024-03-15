import { Module, forwardRef } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';
import { RedeemCodeController } from './redeem_code.controller';
import { RedeemCodeRepository } from './repositories/redeem_code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedeemCode } from './entities/redeem_code.entity';
import { Item } from '../items/entities/item.entity';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { ItemsModule } from '../items/items.module';
import { ExitLogsModule } from '../exit_logs/exit_logs.module';
  
@Module({
  imports: [
    TypeOrmModule.forFeature([RedeemCode, Item, ExitLogs]),
    ItemsModule,
    // ExitLogsModule
    forwardRef(() => ExitLogsModule)
  ],
  controllers: [RedeemCodeController],
  providers: [RedeemCodeService, RedeemCodeRepository],
  exports: [RedeemCodeService, RedeemCodeRepository]
})
export class RedeemCodeModule {}
