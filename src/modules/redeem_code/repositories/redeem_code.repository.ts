import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { RedeemCode } from "../entities/redeem_code.entity";
import { Injectable } from "@nestjs/common";
import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { pagination } from "src/utils/modules_utils/pagination.utils";
import { StatusCode } from "src/enums/status_code.enum";
import { Major } from "src/enums/majors.enum";

@Injectable()
export class RedeemCodeRepository extends Repository<RedeemCode> {
    constructor(public dataSource: DataSource){
        super(RedeemCode, dataSource.createEntityManager());
    }

    async findByRedeemCode(redeemCode: string): Promise<RedeemCode> {
        return this.createQueryBuilder("code")
            .where("code.redeem_code = :redeemCode", {redeemCode})
            .getOne();
    }
    
    async findManyCode(major: Major,filterStatus: StatusCode,pageOptionsDto: PageOptionsDto): Promise<PageDto<RedeemCode>>{
        const queryAlias: string = "redeem_code";

        const whereCondition = (qb: SelectQueryBuilder<RedeemCode>) => {

            if(major) {
                qb.leftJoinAndSelect(`${queryAlias}.exit_log`, 'exit_log').andWhere(
                    'exit_log.for_major = :major',{
                        major
                    }
                )
            }

            if(filterStatus === StatusCode.VALID) {
                qb.andWhere(`${queryAlias}.is_valid = true`)
            } else if (filterStatus == StatusCode.NOT_VALID) {
                qb.andWhere(`${queryAlias}.is_valid = false`)
            } else {
                qb.getMany()
            }
            qb.leftJoinAndSelect(`${queryAlias}.exitLog`, 'exitLog');
            qb.leftJoinAndSelect('exitLog.item_details', 'item_details');
            // else qb.andWhere(`${queryAlias}.is_valid = false`);
        };

        return pagination<RedeemCode>(this, pageOptionsDto, queryAlias, whereCondition);
    }

}