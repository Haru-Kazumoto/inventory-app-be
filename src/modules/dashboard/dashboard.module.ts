import { Module } from '@nestjs/common';
import { ItemsModule } from '../items/items.module';
import { RequestItem } from '../request_items/entities/request_item.entity';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        ItemsModule,
        RequestItem
    ],
    providers: [DashboardService],
    exports: [DashboardService]
})
export class DashboardModule {}
