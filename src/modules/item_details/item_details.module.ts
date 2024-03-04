import { Module } from '@nestjs/common';
import { ItemDetailsService } from './item_details.service';
import { ItemDetailsController } from './item_details.controller';
import { ItemDetailsRepository } from './repositories/item_details.repository';

@Module({
  controllers: [ItemDetailsController],
  providers: [ItemDetailsService, ItemDetailsRepository],
  exports: [ItemDetailsService, ItemDetailsRepository]
})
export class ItemDetailsModule {}
