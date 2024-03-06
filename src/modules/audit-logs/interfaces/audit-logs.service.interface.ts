import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { AuditLogs } from "../entities/audit_logs.entity";
import { CreateAuditLogsDto } from "../dto/create-auditlogs.dto";

export interface IAuditLogsService {
    createReport(body: CreateAuditLogsDto): void;
    getAllReport(pageOptions: PageOptionsDto): Promise<PageDto<AuditLogs>>;
    deleteOneReport(id: number): void;
}