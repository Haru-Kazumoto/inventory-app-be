import { DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => typeOrmConfig(configService),
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
