import { ItemCategory } from 'src/enums/item_category.enum';
import { DataSource, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from '../entities/item.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';
import { StatusItem } from 'src/enums/status_item.enum';
import { ItemCondition } from 'src/enums/item_condition.enum';
import { Major } from 'src/enums/majors.enum';
import { ItemStatusCondition } from 'src/enums/item_status_condition.enum';

@Injectable()
export class ItemsRepository extends Repository<Item> {
  @InjectRepository(Item) itemRepository: Repository<Item>;

  constructor(public dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  public async findMany(
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
            classId,
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

  public async itemByStatus(
    status: ItemStatusCondition,
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    const queryAlias = 'item';
    const whereCondition = (qb: SelectQueryBuilder<Item>) => {
      if (major) {
        qb.andWhere(`${queryAlias}.class = :major`, { major });
      }

      switch (status) {
        case ItemStatusCondition.GOOD_ITEMS:
          qb.andWhere(`${queryAlias}.item_condition = :itemCondition`, {
            itemCondition: ItemCondition.BAIK,
          });
          break;
        case ItemStatusCondition.SEVERELY_DAMAGED_ITEMS:
          qb.andWhere(`${queryAlias}.item_condition = :itemCondition`, {
            itemCondition: ItemCondition.RUSAK_BERAT,
          });
          break;
        case ItemStatusCondition.LIGHTLY_DAMAGED_ITEMS:
          qb.andWhere(`${queryAlias}.item_condition = :itemCondition`, {
            itemCondition: ItemCondition.RUSAK_RINGAN,
          });
          break;
        case ItemStatusCondition.OUT_ITEMS:
          qb.andWhere(`${queryAlias}.status_item != :statusItem`, {
            statusItem: StatusItem.TERSEDIA,
          });
          break;
      }
    };

    return await pagination<Item>(
      this,
      pageOptionsDto,
      queryAlias,
      whereCondition,
    );
  }

  public async findAllItemCodeByItemName(
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

  public async findById(id: number): Promise<Item> {
    return await this.itemRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  public async findItemByItemCode(item_code: string): Promise<Item> {
    return await this.itemRepository.findOne({
      where: {
        item_code: item_code,
      },
      withDeleted: true,
    });
  }

  public async countGoodItems(major: Major) {
    const whereCondition: any = {
      item_condition: ItemCondition.BAIK,
    };

    if (major) {
      whereCondition.class = { major: major };
    }

    return await this.itemRepository.count({
      where: whereCondition,
    });
  }

  public async countSeverelyDamagedItems(major: Major) {
    const whereCondition: any = {
      item_condition: ItemCondition.RUSAK_BERAT,
    };

    if (major) {
      whereCondition.class = { major: major };
    }

    return await this.itemRepository.count({
      where: whereCondition,
    });
  }

  public async countLightlyDamagedItems(major: Major) {
    const whereCondition: any = {
      item_condition: ItemCondition.RUSAK_RINGAN,
    };

    if (major) {
      whereCondition.class = { major: major };
    }

    return await this.itemRepository.count({
      where: whereCondition,
    });
  }

  public async countOutItems(major: Major) {
    const whereCondition: any = {
      status_item: Not(StatusItem.TERSEDIA),
    };

    if (major) {
      whereCondition.class = { major: major };
    }

    return await this.itemRepository.count({
      where: whereCondition,
    });
  }

  public async countItems(major: Major): Promise<number> {
    let whereCondition: any = {};

    if (major) {
      whereCondition.class = { major: major };
    }

    return await this.itemRepository.count({
      where: whereCondition,
    });
  }

  countItemsBy(status: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
