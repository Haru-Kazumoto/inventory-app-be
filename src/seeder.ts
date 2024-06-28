import { seeder } from "nestjs-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "src/modules/role/entities/roles.entity";
import * as dotenv from "dotenv";
import { User } from "./modules/user/entities/user.entity";
import { RoleSeeder } from "./db/seeder/role.seeder";
import { Notification } from "./modules/notification/entities/notification.entity";
import { ClassSeeder } from "./db/seeder/class.seeder";
import { Class } from "./modules/class/entitites/class.entity";
import { Item } from "./modules/items/entities/item.entity";
import { AuditLogs } from "./modules/audit-logs/entities/audit_logs.entity";
import { ItemSeeder } from "./db/seeder/item.seeder";
import { RequestItem } from "./modules/request_items/entities/request_item.entity";
import { ExitLogs } from "./modules/exit_logs/entities/exit_logs.entity";
import { ItemDetails } from "./modules/item_details/entities/item_details.entity";
import { RedeemCode } from "./modules/redeem_code/entities/redeem_code.entity";
import { UserSeeder } from "./db/seeder/user.seeder";

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
            entities: [Roles, User, Notification, Item, Class, AuditLogs]
        }),
        TypeOrmModule.forFeature([
            AuditLogs,
            Class,
            ExitLogs,
            ItemDetails,
            Item,
            Notification,
            RedeemCode,
            RequestItem,
            Roles,
            User,
        ])
    ]
}).run([
    UserSeeder,
    // RoleSeeder,
    // ClassSeeder,
    // ItemSeeder
]);