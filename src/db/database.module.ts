import { DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow('DB_HOST'),
                port: +configService.getOrThrow('DB_PORT'),
                database: configService.getOrThrow('DB_NAME'),
                username: configService.getOrThrow('DB_USERNAME'),
                password: configService.getOrThrow('DB_PASSWORD'),
                autoLoadEntities: configService.getOrThrow('DB_LOAD_ENTITIES'),
                synchronize: configService.getOrThrow('DB_SYNC'),
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                logging: true, //set to true if want to take a look sql
                //MIGRATIONS
                migrations: ["dist/db/migrations/*.js"]
            }),
            inject: [ConfigService],
            imports: [ConfigModule],
            async dataSourceFactory(options: DataSourceOptions) {
                if (!options) {
                  throw new Error('Invalid options passed');
                }
            
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
    ]
})
export class DatabaseModule {}
