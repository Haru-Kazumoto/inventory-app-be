import { PageDto, PageMetaDto, PageOptionsDto } from './../pagination.utils';
import { Repository } from "typeorm";

export async function pagination<T>(
    repository: Repository<T>,
    pageOptionsDto: PageOptionsDto,
    queryAlias: string | any
): Promise<PageDto<T>>{
    const {skip, take, order} = pageOptionsDto;

    const queryBuilder = repository.createQueryBuilder(queryAlias);

    queryBuilder
        .orderBy(`${queryAlias}.created_at`, order)
        .skip(skip)
        .take(take);

    const itemCount = await queryBuilder.getCount();
    const {entities} = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

    return new PageDto(entities, pageMetaDto);

}