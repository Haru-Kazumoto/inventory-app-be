import { DataSource, Repository } from "typeorm";
import { ExitLogs } from "../entities/exit_logs.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RedeemCode } from "src/modules/redeem_code/entities/redeem_code.entity";
import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { pagination } from "src/utils/modules_utils/pagination.utils";

@Injectable()
export class ExitLogsRepository extends Repository<ExitLogs>{
    constructor(
        public dataSource: DataSource,
    ){
        super(ExitLogs, dataSource.createEntityManager());
    }

    async findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs | undefined> {
        return this
            .createQueryBuilder('exit_logs')
            .innerJoinAndSelect('exit_logs.redeem_code', 'redeem_code')
            .where('redeem_code.redeem_code = :redeemCode', { redeemCode })
            .getOne();
    }

    async findManyLogs(pageOptionsDto: PageOptionsDto): Promise<PageDto<ExitLogs>>{
        return pagination<ExitLogs>(this, pageOptionsDto, "exit_logs");
    }

}