import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response as ExressResponse } from 'express';
import { Observable, map } from 'rxjs';

interface Response<T> {
    statusCode: number;
    timestamp: Date;
    payload: T
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExressResponse>();

    return next.handle().pipe(
      map(data => ({
        statusCode: response.statusCode,
        timestamp: new Date(),
        payload: data
      }))
    );
  }
}
