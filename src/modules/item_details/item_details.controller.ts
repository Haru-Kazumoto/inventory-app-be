import { Controller } from '@nestjs/common';
import { ItemDetailsService } from './item_details.service';

@Controller('item-details')
export class ItemDetailsController {
  constructor(private readonly itemDetailsService: ItemDetailsService) {}
}
