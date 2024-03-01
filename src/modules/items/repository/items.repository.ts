import { DataSource, Repository } from "typeorm";
import { Item } from "../entities/item.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/utils/pagination.utils";

@Injectable()
export class ItemsRepository extends Repository<Item> {
    @InjectRepository(Item) itemRepository: Repository<Item>;

    constructor(public dataSource: DataSource){
        super(Item, dataSource.createEntityManager());
    }

    async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>> {
        const queryBuilder = this.itemRepository.createQueryBuilder("item");

        queryBuilder
            .orderBy("item.created_at", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const {entities} = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

        return new PageDto(entities, pageMetaDto);
    }

    async findById(id: number): Promise<Item> {
        return await this.itemRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async findItemByItemCode(item_code: string): Promise<Item> {
        return await this.itemRepository.findOne({
            where: {
                item_code: item_code
            },
            withDeleted: true
        });
    }

    //TODO : CHANGE THE LOGIC SEARCH BY CATEGORY (DYNAMIC)
    async findManyBy(category: string,pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>> {
        const queryBuilder = this.itemRepository.createQueryBuilder("item");

        queryBuilder
            .orderBy("item.created_at", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const {entities} = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

        return new PageDto(entities, pageMetaDto);
    }

    countItemsBy(status: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}