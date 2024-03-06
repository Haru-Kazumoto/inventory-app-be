import { Request } from 'express';
import { ENTITY_MANAGER_KEY } from 'src/interceptors/transaction.interceptor';
import { DataSource, EntityManager, Repository } from 'typeorm';

export class BaseRepository {
  constructor(private dataSource: DataSource, private request: Request) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}