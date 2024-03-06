import { Controller } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';

@Controller('redeem-code')
export class RedeemCodeController {
  constructor(private readonly redeemCodeService: RedeemCodeService) {}
}
