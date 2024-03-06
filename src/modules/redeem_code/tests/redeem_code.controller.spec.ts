import { Test, TestingModule } from '@nestjs/testing';
import { RedeemCodeController } from '../redeem_code.controller';
import { RedeemCodeService } from '../redeem_code.service';

describe('RedeemCodeController', () => {
  let controller: RedeemCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedeemCodeController],
      providers: [RedeemCodeService],
    }).compile();

    controller = module.get<RedeemCodeController>(RedeemCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
