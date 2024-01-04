import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ResponseHttp } from './utils/response.http.utils';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ConfigurationAppModule } from './config/config.module';

@Module({
  imports: [
    ConfigurationAppModule,
    UserModule,
    DatabaseModule,
    AuthModule
  ],
  providers: [ResponseHttp],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
