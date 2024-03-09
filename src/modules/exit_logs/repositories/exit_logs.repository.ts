import { DataSource, Repository } from "typeorm";
import { ExitLogs } from "../entities/exit_logs.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RedeemCode } from "src/modules/redeem_code/entities/redeem_code.entity";

@Injectable()
export class ExitLogsRepository extends Repository<ExitLogs>{
    constructor(
        public dataSource: DataSource,
    ){
        super(ExitLogs, dataSource.createEntityManager());
    }

    async findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs | undefined> {
        return this.createQueryBuilder("exitLogs")
            .leftJoinAndSelect("exitLogs.redeem_code", "redeemCode")
            .where("redeemCode.redeem_code = :redeemCode", { redeemCode })
            .getOne();
    }

}