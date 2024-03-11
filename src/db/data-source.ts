import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    database: "Inventory-app DB",
    username: "postgres",
    password: "Ayasbogor123_",
    entities: ["dist/**/*.entity.js"],
    //MIGRATIONS
    migrations: ["dist/db/migrations/*.js"],
    migrationsTableName: "migrations",
    migrationsRun: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;