import { RedeemCode } from "./entities/redeem_code.entity";

export interface IRedeemCodeService {
    generateRedeemCode(): Promise<RedeemCode>;
}