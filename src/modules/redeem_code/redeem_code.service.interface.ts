import { CreateExitLogDto } from "../exit_logs/dtos/exit_logs.dto";
import { ExitLogs } from "../exit_logs/entities/exit_logs.entity";
import { CreateRedeemCodeDto } from "./dtos/redeem_code.dto";
import { RedeemCode } from "./entities/redeem_code.entity";

export interface IRedeemCodeService {
    createRedeemCode(body: CreateExitLogDto): Promise<RedeemCode>;
    useRedeemCode(redeemCode: string): Promise<ExitLogs>;
    findByRedeemCode(redeemCode: string): Promise<RedeemCode>;
    generateRedeemCode(): string;
}