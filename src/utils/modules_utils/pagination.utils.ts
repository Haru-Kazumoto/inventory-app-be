import { PageDto, PageMetaDto, PageOptionsDto } from './../pagination.utils';
import { Repository, SelectQueryBuilder } from 'typeorm';

export async function pagination<T>(
  repository: Repository<T>,
  pageOptionsDto: PageOptionsDto,
  queryAlias: string | any,
  whereCondition?: (qb: SelectQueryBuilder<T>) => void,
): Promise<PageDto<T>> {
  const { skip, take, order } = pageOptionsDto;
  const queryBuilder = repository.createQueryBuilder(queryAlias);

  if (whereCondition) whereCondition(queryBuilder);

  queryBuilder.orderBy(`${queryAlias}.created_at`, order).skip(skip).take(take)
    .withDeleted;

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  return new PageDto(entities, pageMetaDto);
}
