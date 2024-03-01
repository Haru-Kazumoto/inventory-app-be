import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ConfigurationAppModule } from './config/config.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { ClassModule } from './modules/class/class.module';
import { RedeemCodeModule } from './modules/redeem_code/redeem_code.module';
import { ItemDetailsModule } from './modules/item_details/item_details.module';
import { ExitLogsModule } from './modules/exit_logs/exit_logs.module';
import { ItemsModule } from './modules/items/items.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/filters/exception.filter';

@Module({
  imports: [
    ConfigurationAppModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    NotificationModule,
    AuditLogsModule,
    ClassModule,
    RedeemCodeModule,
    ItemDetailsModule,
    ItemsModule,
    ExitLogsModule,
  ],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
