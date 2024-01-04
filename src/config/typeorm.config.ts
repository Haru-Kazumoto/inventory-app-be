import { Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST'),
    port: +configService.getOrThrow('DB_PORT'),
    database: configService.getOrThrow('DB_NAME'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    autoLoadEntities: configService.getOrThrow('DB_LOAD_ENTITIES'),
    synchronize: configService.getOrThrow('DB_SYNC'),
    entities: [__dirname + '/../**/*.entity.{js,ts}']
});

export async function dataSourceFactory(options: DataSourceOptions) {
    if (!options) {
      throw new Error('Invalid options passed');
    }

    return addTransactionalDataSource(new DataSource(options));
}