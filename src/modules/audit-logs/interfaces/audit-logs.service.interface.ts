import { AuditLogs } from '../entities/audit_logs.entity';
import { CreateAuditLogsDto } from '../dto/create-auditlogs.dto';

export interface IAuditLogsService {
  createReport(body: CreateAuditLogsDto): void;
  getAllReport(): Promise<AuditLogs[]>;
  deleteOneReport(id: number): void;
}
