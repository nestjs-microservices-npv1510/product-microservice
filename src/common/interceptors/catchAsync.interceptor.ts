import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

function formatPrismaErrorMessage(errorMessage: string): string {
  return errorMessage

    .replace(/(\s{2,})/g, ' ') // Xoá khoảng trắng thừa
    .replace(/\{|\}/g, (match) => `\n${match}\n`) // Định dạng dấu ngoặc
    .replace(/\[/g, '[\n') // Xuống dòng cho mảng
    .replace(/\]/g, '\n]') // Xuống dòng cho kết thúc mảng
    .replace(/,/g, ',\n') // Thêm xuống dòng sau dấu phẩy
    .replace(/~+/g, '') // Xoá dấu ~ nếu có
    .replace(/\n/g, ''); // Xoá ký tự xuống dòng
}

@Injectable()
export class CatchAsyncInterceptor implements NestInterceptor {
  private readonly logger = new Logger('CatchAsyncInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(`Error name: ${err.name || 'Unknown error type'}`);
        this.logger.error(`Error: ${JSON.stringify(err)}`);

        // console.log(err);
        // if (err instanceof RpcException) throw err;

        if (err?.name === 'PrismaClientValidationError') {
          throw new RpcException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message:
              formatPrismaErrorMessage(err.message) ||
              'Something failed to validate',
          });
        }

        throw new RpcException({ ...err });
      }),
    );
  }
}
