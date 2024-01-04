import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(err: Error, host: ArgumentsHost) {
    const exception = err instanceof HttpException ? err : new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      error: exception.name
    });
  }
}