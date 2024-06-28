import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { ItemCategory } from 'src/enums/item_category.enum';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { CreateItemDto } from 'src/modules/items/dto/create-item.dto';
import { Item } from 'src/modules/items/entities/item.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';

@Injectable()
export class ItemSeeder implements Seeder {

    constructor(
        @InjectRepository(Item) private readonly itemRepository: Repository<Item>
    ){}

    async seed(): Promise<any> {
        await this.seedItems();
    }

    async seedItems(): Promise<any>{
        const itemData: CreateItemDto[] = [
            {
                name: "RJ-45",
                item_code: "RJ-728843",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_HABIS_PAKAI,
                unit_price: 50000,
                // source_fund: "BOSDA",
                total_unit: "10 PACK",
                class_id: 1
            },
            {
                name: "KABEL LAN",
                item_code: "LAN-839457",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_HABIS_PAKAI,
                unit_price: 150000,
                // source_fund: "BOSDA",
                total_unit: "1 ROLL",
                class_id: 1
            },
            {
                name: "KABEL OPTIC",
                item_code: "OPT-82794",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_HABIS_PAKAI,
                unit_price: 200000,
                // source_fund: "BOSDA",
                total_unit: "2 ROLL",
                class_id: 1
            },
        ];
        
        try{
            await Promise.all(
                itemData.map((item) => {
                    const newItem = this.itemRepository.create(item);
                        
                    this.itemRepository.save(newItem);
                })
            );

            Logger.log(`[ITEM] Seeder succcess with data : ${await this.itemRepository.count()}`, "SEEDER");

        } catch(err) {
            if(err instanceof TransactionalError){
                Logger.log("Seeding data failed.", "SEEDER");
                throw new TransactionalError("Error seeding data.");
            }
        }
    }

    async drop(): Promise<any> {
        await this.itemRepository.delete({});

        Logger.log("[ITEM] Data has dropped.", "SEEDER");
    }    
}
