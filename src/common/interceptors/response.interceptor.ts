import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseEntity, IResponsePageWrapper } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => {
        const response: IResponseEntity<unknown> = {
          code: context.switchToHttp().getResponse().statusCode,
          status: true,
          message: 'Successfully retrieve data',
        };

        if (res !== undefined && res !== null) {
          if (Array.isArray(res)) {
            response.data = res;
          } else if (this.isPageWrapper(res)) {
            response.data = res.data;
            response.meta = res.meta;
          } else {
            response.data = res;
          }
        }

        return response;
      }),
    );
  }

  private isPageWrapper(value: unknown): value is IResponsePageWrapper<unknown> {
    return typeof value === 'object' && value !== null && 'data' in value && 'meta' in value;
  }
}