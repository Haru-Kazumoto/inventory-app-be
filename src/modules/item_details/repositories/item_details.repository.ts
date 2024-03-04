import { DataSource, Repository } from "typeorm";
import { ItemDetails } from "../entities/item_details.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemDetailsRepository extends Repository<ItemDetails> {
    constructor(public dataSource: DataSource){
        super(ItemDetails, dataSource.createEntityManager());
    }   
}