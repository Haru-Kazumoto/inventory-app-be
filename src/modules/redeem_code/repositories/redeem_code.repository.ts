import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { RedeemCode } from "../entities/redeem_code.entity";
import { Injectable } from "@nestjs/common";
import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { pagination } from "src/utils/modules_utils/pagination.utils";

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
    
    async findManyCode(filterStatus: "VALID" | "NOT VALID",pageOptionsDto: PageOptionsDto): Promise<PageDto<RedeemCode>>{
        const queryAlias: string = "redeem_code";

        const whereCondition = (qb: SelectQueryBuilder<RedeemCode>) => {
            if(filterStatus === "VALID") qb.where(`${queryAlias}.is_valid = true`);
            else qb.andWhere(`${queryAlias}.is_valid = false`);
        };

        return pagination<RedeemCode>(this, pageOptionsDto, queryAlias, whereCondition);
    }

}