import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(6000), //Set timeout to 1 minutes
        catchError(err => {
          if(err instanceof TimeoutError){
            return throwError(() => new RequestTimeoutException());
          }

          return throwError(() => err);
        })
      )
  }
}
