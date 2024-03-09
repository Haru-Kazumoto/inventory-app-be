import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { ExitLogs } from "./entities/exit_logs.entity";
import { CreateExitLogDto } from "./dtos/exit_logs.dto";
import { RedeemCode } from "../redeem_code/entities/redeem_code.entity";

export enum FilterParam {
    NAME="NAME",
    PHONE="PHONE",
    ITEM_CATEGORY="ITEM_CATEGORY"
}

export interface IExitLogsService {
    createLog(body: CreateExitLogDto): Promise<ExitLogs>;
    findAllLogs(pageOptionsDto: PageOptionsDto, filter?: FilterParam): Promise<PageDto<ExitLogs>>;
    findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs>;
}