import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { CreateExitLogDto, UpdateExitLogDto } from "../../exit_logs/dtos/exit_logs.dto";
import { ExitLogs } from "../../exit_logs/entities/exit_logs.entity";
import { RedeemCode } from "../entities/redeem_code.entity";
import { StatusCode } from "src/enums/status_code.enum";
import { Major } from "src/enums/majors.enum";

export interface IRedeemCodeService {
    createRedeemCode(body: CreateExitLogDto): Promise<RedeemCode>;
    storeRedeemCode(redeemCode: string): Promise<RedeemCode>;
    updateRedeemCode(redeemCode: string, body: UpdateExitLogDto): Promise<RedeemCode>;
    findByRedeemCode(redeemCode: string): Promise<RedeemCode>;
    generateRedeemCode(): string;
    findAllRedeemCodes(major: Major, filterStatus: StatusCode,pageOptions: PageOptionsDto): Promise<PageDto<RedeemCode>>;
    findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs>;
}