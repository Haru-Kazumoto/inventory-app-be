import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv"

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "database_inventorys",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD ||"Akbar_123",
    entities: ["dist/**/*.entity.js"],
    //MIGRATIONS
    migrations: ["dist/db/migrations/*.js"],
    migrationsTableName: "migrations",
    migrationsRun: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;