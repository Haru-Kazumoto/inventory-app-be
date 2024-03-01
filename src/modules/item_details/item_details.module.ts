import { Module } from '@nestjs/common';
import { ItemDetailsService } from './item_details.service';
import { ItemDetailsController } from './item_details.controller';

@Module({
  controllers: [ItemDetailsController],
  providers: [ItemDetailsService]
})
export class ItemDetailsModule {}
