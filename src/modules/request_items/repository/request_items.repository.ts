import { Injectable } from '@nestjs/common';
import { RequestItem } from '../entities/request_item.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { RequestStatus } from 'src/enums/request_status.enum';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from 'src/enums/majors.enum';

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

  public async countPendingRequest(major: Major) {
    const whereCondition: any = {
      status: RequestStatus.PENDING,
    };

    if (major) {
      whereCondition.class = { major: major };
    }

    return this.requestItemRepository.count({
      where: whereCondition,
    });
  }

  public async requestItemByStatus(
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    const queryAlias = 'request_item';

    const whereCondition = (qb: SelectQueryBuilder<RequestItem>) => {
      if (major) {
        qb.andWhere(`${queryAlias}.class = :major`, { major });
      }

      qb.where(`${queryAlias}.status = :pending`, {
        pending: RequestStatus.PENDING,
      });
    };

    return await pagination<RequestItem>(
      this,
      pageOptionsDto,
      queryAlias,
      whereCondition,
    );
  }

  countRequestItemsBy(status: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
