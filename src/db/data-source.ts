import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    database: "database_inventory",
    username: "postgres",
    password: "Akbar_123",
    entities: ["dist/**/*.entity.js"],
    //MIGRATIONS
    migrations: ["dist/db/migrations/*.js"],
    migrationsTableName: "migrations",
    migrationsRun: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;