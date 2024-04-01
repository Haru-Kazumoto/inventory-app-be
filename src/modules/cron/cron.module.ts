import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RedeemCodeModule } from '../redeem_code/redeem_code.module';
import { RequestItem } from '../request_items/entities/request_item.entity';
import { CronService } from './cron.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        // RedeemCodeModule,
        // RequestItem,
        // NotificationModule
    ],
    providers: [CronService],
    exports: [CronService]
})
export class CronModule {}
