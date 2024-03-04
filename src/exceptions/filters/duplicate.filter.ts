import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DuplicateKeyExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if(exception.message.includes("duplicate key value violates unique constraint")){
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: response.statusCode,
        message: "Failed querying, there is duplicate data in your request"
      });
    } else {
      throw exception;
    }
  }
}