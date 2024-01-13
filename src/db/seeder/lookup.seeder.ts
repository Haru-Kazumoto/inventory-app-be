import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Lookup } from "src/modules/lookup/entities/lookup.entity";
import { LookupType } from "src/modules/lookup/enums/lookup-type.enum";
import { Repository } from "typeorm";

export class LookupSeeder implements Seeder {

    constructor(
        @InjectRepository(Lookup) private readonly lookupRepository: Repository<Lookup>
    ){}

    async seed(): Promise<any> {
        this.seedCategory();
        this.seedStatus();

        Logger.log(`[LOOKUP] Seeder succcess with data : ${await this.lookupRepository.count()}`, "SEEDER")
    }

    async seedStatus(): Promise<any>{
        const statusData = [
            {
                name: "Barang Rusak Ringan",
                type: "ITEM_STATUS",
                value: "RUSAK_RINGAN"
             },
             {
                 name: "Barang Rusak Berat",
                 type: "ITEM_STATUS",
                 value: "RUSAK_BERAT"
             },
             {
                 name: "Barang Baik",
                 type: "ITEM_STATUS",
                 value: "BAIK"
             },
             {
                 name: "Barang Hilang",
                 type: "ITEM_STATUS",
                 value: "BARANG_HILANG"
             }
        ];
        
        await this.createMany(statusData);
    }

    async seedCategory(){
        const categoryData = [
            {
                name: "Alat Tulis Kantor",
                type: "CATEGORY",
                value: "ATK"
            },
            {
                name: "Barang biasa",
                type: "CATEGORY",
                value: "NON_ATK"
            }
        ];

        await this.createMany(categoryData);
    }

    async createMany(data: [] | any){
        await Promise.all(data.map((lookups: Lookup) => this.lookupRepository.save(
            this.lookupRepository.create(lookups)
        )));
    }

    async drop(): Promise<any> {
        await this.lookupRepository.delete({});

        Logger.log("[LOOKUP] Data has dropped.", "SEEDER");
    }
    
}