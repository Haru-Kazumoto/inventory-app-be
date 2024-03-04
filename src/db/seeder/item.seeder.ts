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
                name: "MIKROTIK",
                item_code: "MKT-938573",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-345687",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-123456",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-346782",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-125432",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-234152",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-345567",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-234569",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            },
            {
                name: "MIKROTIK",
                item_code: "MKT-123497",
                item_type: ItemType.NON_ATK,
                category_item: ItemCategory.BARANG_TIDAK_HABIS_PAKAI,
                unit_price: 1000000,
                source_fund: "BOSDA",
                status_item: StatusItem.TERSEDIA,
                class_id: 1
            }
        ];
        
        try{
            // await Promise.all(
            //     classData.map(classDataParam => this.classRepository.save(
            //         this.classRepository.create(classDataParam))
            //     )
            // );
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
