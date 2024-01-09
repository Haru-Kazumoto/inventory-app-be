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
        const lookupData = [
            {
               name: "Barang Rusak Ringan",
               type: LookupType.RUSAK_RINGAN,
               value: "RUSAK_RINGAN"
            },
            {
                name: "Barang Rusak Berat",
                type: LookupType.RUSAK_BERAT,
                value: "RUSAK_BERAT"
            },
            {
                name: "Barang Baik",
                type: LookupType.BAIK,
                value: "BAIK"
             }
        ];

        await Promise.all(lookupData.map((lookups) => this.lookupRepository.save(
            this.lookupRepository.create(lookups)
        )));

        Logger.log(`[LOOKUP] Seeder succcess with data : ${await this.lookupRepository.count()}`, "SEEDER")
    }
    async drop(): Promise<any> {
        await this.lookupRepository.delete({});

        Logger.log("[LOOKUP] Data has dropped.", "SEEDER");
    }
    
}