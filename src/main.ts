import { NestFactory } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional/dist/common';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from './modules/auth/session/session.entity';
import config, { 
  passportConfig, 
  globalPipesRegistrar,
  // globalInterceptorRegistrar,
  setupSwagger 
} from "./config/application.config";
import * as session from 'express-session';
import * as dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, 
    // {cors: config.corsOption}
    );
  const sessionRepository = app.get(DataSource).getRepository(Session);

  app.enableCors({
    credentials: true,
    origin: "http://localhost:5173",
    
  })
  app.setGlobalPrefix(config.globalPrefix);
  app.use(
    session(
      {
        name: config.cookieOptions.name,
        secret: "8C121F33FD1B74731D9E613E217B3",
        resave: config.cookieOptions.resave,
        saveUninitialized: config.cookieOptions.saveUninitialized,
        cookie: { maxAge: config.cookieOptions.maxAge },
        store: new TypeormStore({
          cleanupLimit: config.cookieOptions.store.cleanupLimit,
          ttl: config.cookieOptions.store.ttl,
          secret: process.env.COOKIE_SECRET_KEY as string
        }).connect(sessionRepository)
      }
    )
  );

  setupSwagger(app);
  passportConfig(app);
  
  globalPipesRegistrar(app);
  
  try{
    await app.listen(process.env.APP_PORT);
    
    if(process.env.NODE_STATUS == "DEV"){
      Logger.log(`Nest running on port ${process.env.APP_PORT}`, "Application")
      Logger.log(`Swagger available at ${process.env.APP_URL}/api`, "Swagger")
    }

  } catch(error) {
    Logger.log(`Error starting Nest application: ${error}`, "","Application", false);
    process.exit(1);
  }
}

bootstrap();