import { DataSource, Repository } from "typeorm";
import { RedeemCode } from "../entities/redeem_code.entity";
import { Injectable } from "@nestjs/common";

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
    
}