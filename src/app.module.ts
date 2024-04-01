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
import { AuthSessionMiddleware } from './middleware/auth-session.middleware';
import { RequestItemsModule } from './modules/request_items/request_items.module';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExcelService } from './utils/excel/excel.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CronModule } from './modules/cron/cron.module';

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
    RequestItemsModule,
    DashboardModule,
    CronModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    },
    ExcelService
  ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware,AuthSessionMiddleware).forRoutes('*');
    }
}
