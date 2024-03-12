import { ItemCategory } from 'src/enums/item_category.enum';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from '../entities/item.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';
import { StatusItem } from 'src/enums/status_item.enum';

@Injectable()
export class ItemsRepository extends Repository<Item> {
  @InjectRepository(Item) itemRepository: Repository<Item>;

  constructor(public dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async findMany(
    category: ItemCategory,
    classId: number,
    itemName: string,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    const queryAlias = 'item';

    const whereCondition = (qb: SelectQueryBuilder<Item>) => {
      if (category) {
        qb.andWhere(`${queryAlias}.category_item = :category`, {
          category,
        });
      }
      if (status) {
        qb.andWhere(`${queryAlias}.status_item = :status`, {
          status,
        });
      }
      if (classId) {
        qb.leftJoinAndSelect(`${queryAlias}.class`, 'class').andWhere(
          `class.id = :classId`,
          {
            classId
          },
        );
      }
      if (itemName) {
        qb.andWhere(`${queryAlias}.name LIKE :itemName`, {
          itemName: `%${itemName}%`,
        });
      }
    };

    return await pagination<Item>(
      this,
      pageOptionsDto,
      queryAlias,
      whereCondition,
    );
  }

  async findAllItemCodeByItemName(
    itemName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    const queryAlias = 'item';

    const whereCondition = (qb: SelectQueryBuilder<Item>) => {
      qb.where(`${queryAlias}.name = :itemName`, {
        itemName,
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
