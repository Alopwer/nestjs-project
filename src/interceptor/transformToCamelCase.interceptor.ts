import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { keysToCamel } from 'src/utils/keysToCamel';

@Injectable()
export class TransformToCamelCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => keysToCamel(value)));
  }
}
