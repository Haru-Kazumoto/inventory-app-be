import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from "cls-hooked";
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const session = cls.createNamespace('session');

    session.run(() => {
      session.set("request", req);

      next();
    });
  }
}
