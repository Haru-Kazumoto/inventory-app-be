import { DataSource, Repository } from "typeorm";
import { AuditLogs } from "../entities/audit_logs.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuditLogsRepository extends Repository<AuditLogs> {
    constructor(public dataSource: DataSource){
        super(AuditLogs, dataSource.createEntityManager());
    }   


}