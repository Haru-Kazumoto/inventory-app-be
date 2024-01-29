import { seeder } from "nestjs-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "src/modules/role/entities/roles.entity";
import * as dotenv from "dotenv";
import { User } from "./modules/user/entities/user.entity";
import { RoleSeeder } from "./db/seeder/role.seeder";
import { Notification } from "./modules/notification/entities/notification.entity";

dotenv.config();

seeder({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            autoLoadEntities: Boolean(process.env.DB_LOAD_ENTITIES),
            synchronize: Boolean(process.env.DB_SYNC),
            entities: [Roles, User, Notification]
        }),
        TypeOrmModule.forFeature([
            Roles, 
            User, 
            Notification
        ])
    ]
}).run([
    RoleSeeder,
]);