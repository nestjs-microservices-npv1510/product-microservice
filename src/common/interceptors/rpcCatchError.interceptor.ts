import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isInstance } from 'class-validator';
import { error } from 'console';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RpcCatchErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RpcCatchErrorInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(JSON.stringify(err));

        // Nếu err đã là Rpc Exception => chỉ gửi
        if (err instanceof RpcException) throw err;

        // Nếu err không phải RpcExeption chuyển thành RpcException và gửi
        throw new RpcException({ ...err });
      }),
    );
  }
}
