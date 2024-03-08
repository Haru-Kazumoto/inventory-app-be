import { DataSource, Repository } from 'typeorm';
import { Class } from '../entitites/class.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';

@Injectable()
export class ClassRepository extends Repository<Class> {
  @InjectRepository(Class) classRepository: Repository<Class>;

  constructor(public dataSource: DataSource) {
    super(Class, dataSource.createEntityManager());
  }

  async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<Class>> {
    return pagination<Class>(this, pageOptionsDto, 'class');
  }

  async findClassById(id: number): Promise<Class> {
    return await this.createQueryBuilder('class')
      .where('class.id = :id', { id })
      .getOne();
  }
}
