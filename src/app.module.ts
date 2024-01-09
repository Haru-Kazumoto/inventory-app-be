import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ResponseHttp } from './utils/response.http.utils';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ConfigurationAppModule } from './config/config.module';
import { ExitlogModule } from './modules/exit-log/exitlog.module';
import { ItemsModule } from './modules/items/items.module';
import { ClassModule } from './modules/class/class.module';
import { ItemRequestModule } from './modules/item-request/item-request.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LookupModule } from './modules/lookup/lookup.module';
import { ExititemModule } from './modules/exit-item/exititem.module';

@Module({
  imports: [
    ConfigurationAppModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    LookupModule,
    ExitlogModule,
    ItemsModule,
    ClassModule,
    ExititemModule,
    ItemRequestModule,
    NotificationModule
  ],
  providers: [ResponseHttp],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
