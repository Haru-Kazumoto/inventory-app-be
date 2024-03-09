import { ItemCategory } from 'src/enums/item_category.enum';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from '../entities/item.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';

@Injectable()
export class ItemsRepository extends Repository<Item> {
  @InjectRepository(Item) itemRepository: Repository<Item>;

  constructor(public dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async findMany(
    category: ItemCategory,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    const queryAlias = 'item';

    const whereCondition = (qb: SelectQueryBuilder<Item>) => {
      qb.where(`${queryAlias}.category_item = :category`, {
        category,
      });
    };

    return await pagination<Item>(
      this,
      pageOptionsDto,
      queryAlias,
      whereCondition,
    );
  }

  async findById(id: number): Promise<Item> {
    return await this.itemRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findItemByItemCode(item_code: string): Promise<Item> {
    return await this.itemRepository.findOne({
      where: {
        item_code: item_code,
      },
      withDeleted: true,
    });
  }

  countItemsBy(status: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
