import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional/dist/common';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from './modules/session/session.entity';
import config, { passportConfig, pipesRegistrar } from "./config/security.config";
import * as session from 'express-session';
import * as dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {cors: config.corsOption});
  const sessionRepository = app.get(DataSource).getRepository(Session);

  app.setGlobalPrefix(config.globalPrefix);
  app.use(
    session(
      {
        name: config.cookieOptions.name,
        secret: config.cookieOptions.secret,
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
  
  passportConfig(app);
  pipesRegistrar(app);
  
  try{
    await app.listen(process.env.APP_PORT);
    Logger.log(`Nest running on port ${process.env.APP_PORT}`, "Application")
  } catch(error) {
    Logger.log(`Error starting Nest application: ${error}`, "","Application", false);
    process.exit(1);
  }
}

bootstrap();