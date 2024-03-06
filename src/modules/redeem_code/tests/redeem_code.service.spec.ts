import { Test, TestingModule } from '@nestjs/testing';
import { RedeemCodeService } from '../redeem_code.service';

describe('RedeemCodeService', () => {
  let service: RedeemCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedeemCodeService],
    }).compile();

    service = module.get<RedeemCodeService>(RedeemCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
