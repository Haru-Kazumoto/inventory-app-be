import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { ExitLogs } from "./entities/exit_logs.entity";
import { CreateExitLogDto } from "./dtos/exit_logs.dto";

export enum FilterParam {
    NAME="NAME",
    PHONE="PHONE",
    ITEM_CATEGORY="ITEM_CATEGORY"
}

export interface IExitLogsService {
    createLog(body: CreateExitLogDto): Promise<ExitLogs>;
    findAllLogs(pageOptionsDto: PageOptionsDto, filter?: FilterParam): Promise<PageDto<ExitLogs>>;
}