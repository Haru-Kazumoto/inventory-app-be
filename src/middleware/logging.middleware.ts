import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {

    Logger.log(`Incoming request [${req.method}] - [${req.originalUrl}] - ${new Date()}`, "Request HTTP")

    next();
  }
}
