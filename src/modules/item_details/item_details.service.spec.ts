import { Test, TestingModule } from '@nestjs/testing';
import { ItemDetailsService } from './item_details.service';

describe('ItemDetailsService', () => {
  let service: ItemDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemDetailsService],
    }).compile();

    service = module.get<ItemDetailsService>(ItemDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
