import { Module } from '@nestjs/common';
import { ItemRequestService } from './item-request.service';
import { ItemRequestController } from './item-request.controller';

@Module({
  controllers: [ItemRequestController],
  providers: [ItemRequestService]
})
export class ItemRequestModule {}
