import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  { data: T; timestamp: string }
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ data: T; timestamp: string }> {
    return next.handle().pipe(
      map((data) => ({
        data: instanceToPlain(data) as T,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
