import { Injectable } from '@nestjs/common';
import { RequestItem } from '../entities/request_item.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { RequestStatus } from 'src/enums/request_status.enum';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestItemsRepository extends Repository<RequestItem> {
  @InjectRepository(RequestItem) requestItemRepository: Repository<RequestItem>;

  constructor(public dataSource: DataSource) {
    super(RequestItem, dataSource.createEntityManager());
  }

  public async findMany(
    className: string,
    status: RequestStatus,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>> {
    const queryAlias = 'request_item';

    const whereCondition = (qb: SelectQueryBuilder<RequestItem>) => {
      if (status) {
        qb.andWhere(`${queryAlias}.status = :status`, {
          status,
        });
      }
      if (className) {
        qb.leftJoinAndSelect(`${queryAlias}.class`, 'class').andWhere(
          `class.class_name = :className`,
          {
            className,
          },
        );
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
