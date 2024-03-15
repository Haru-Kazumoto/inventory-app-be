import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { ExitLogs } from "./entities/exit_logs.entity";
import { CreateExitLogDto, UpdateExitLogDto } from "./dtos/exit_logs.dto";
import { RedeemCode } from "../redeem_code/entities/redeem_code.entity";
import { ItemCategory } from "src/enums/item_category.enum";

export enum FilterParam {
    NAME="NAME",
    PHONE="PHONE",
    ITEM_CATEGORY="ITEM_CATEGORY"
}

export interface IExitLogsService {
    
    findLogById(logId: number): Promise<ExitLogs>;
    findLogByBorrowerName(borrowerName: string): Promise<ExitLogs>;
    findAllLogs(filterCagory: ItemCategory,pageOptionsDto: PageOptionsDto, filter?: FilterParam): Promise<PageDto<ExitLogs>>;
    updateExitLog(redeemCode: string, body: UpdateExitLogDto): Promise<RedeemCode>;
    
}