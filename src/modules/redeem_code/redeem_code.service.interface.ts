import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { CreateExitLogDto } from "../exit_logs/dtos/exit_logs.dto";
import { ExitLogs } from "../exit_logs/entities/exit_logs.entity";
import { RedeemCode } from "./entities/redeem_code.entity";

export interface IRedeemCodeService {
    createRedeemCode(body: CreateExitLogDto): Promise<RedeemCode>;
    storeRedeemCode(redeemCode: string): Promise<RedeemCode>;
    updateRedeemCode(redeemCode: string): Promise<RedeemCode>;
    findByRedeemCode(redeemCode: string): Promise<RedeemCode>;
    generateRedeemCode(): string;
    findAllRedeemCodes(pageOptions: PageOptionsDto): Promise<PageDto<RedeemCode>>;
    findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs>;
}