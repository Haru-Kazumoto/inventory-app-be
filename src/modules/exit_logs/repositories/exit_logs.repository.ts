import { DataSource, Repository } from "typeorm";
import { ExitLogs } from "../entities/exit_logs.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ExitLogsRepository extends Repository<ExitLogs>{
    constructor(public dataSource: DataSource){
        super(ExitLogs, dataSource.createEntityManager());
    }
}