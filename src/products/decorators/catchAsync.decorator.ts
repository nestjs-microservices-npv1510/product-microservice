import { HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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

export function CatchAsyncErrors() {
  const logger = new Logger('CatchAsyncErrors');
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        logger.error('Error handled by CatchAsyncErrors');
        logger.error(error?.name || 'Unknown error');

        if (error?.name === 'PrismaClientValidationError') {
          throw new RpcException({
            statusCode: HttpStatus.CONFLICT,
            message:
              formatPrismaErrorMessage(error.message) ||
              'Something failed to validate',
          });
        }

        throw new RpcException({ ...error });

        // console.error('⚠️⚠️⚠️⚠️  Error caught by async decorator:');
        // console.log(`message: ${error.message}`);
        // const exception = new RpcException({ ...error });
        // console.log(exception);
        // throw exception;
      }
    };
  };
}
