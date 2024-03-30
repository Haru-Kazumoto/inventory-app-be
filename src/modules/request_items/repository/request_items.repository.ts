import { Injectable } from '@nestjs/common';
import { RequestItem } from '../entities/request_item.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { RequestStatus } from 'src/enums/request_status.enum';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';

@Injectable()
export class RequestItemsRepository extends Repository<RequestItem> {
  @InjectRepository(RequestItem) requestItemRepository: Repository<RequestItem>;

  constructor(public dataSource: DataSource) {
    super(RequestItem, dataSource.createEntityManager());
  }

  public async findMany(
    majorName: Major,
    status: RequestStatus,
    item_type: ItemType,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>> {
    const queryAlias = 'request_item';

    const whereCondition = (qb: SelectQueryBuilder<RequestItem>) => {
      if (status) {
        qb.andWhere(`${queryAlias}.status = :status`, {
          status,
        });
      }
      if (majorName) {
        qb.leftJoinAndSelect(`${queryAlias}.class`, 'class').andWhere(
          `class.major = :majorName`,
          {
            majorName,
          },
        );
      }
      if(item_type) {
        qb.andWhere(`${queryAlias}.item_type = :item_type`, {item_type});
      }
    };

    return await pagination<RequestItem>(
      this,
      pageOptionsDto,
      queryAlias,
      whereCondition,
    );
  }

  public findById(id: number): Promise<RequestItem> {
    return this.requestItemRepository.findOneBy({ id });
  }

  countRequestItemsBy(status: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
