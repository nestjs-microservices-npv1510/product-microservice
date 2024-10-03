// NestJs
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// modukes
import { AppModule } from './app.module';

// interceptors
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CatchAsyncInterceptor } from './common/interceptors/catchAsync.interceptor';

// envs
import * as config from './config';

async function bootstrap() {
  const logger = new Logger('Main');

  // console.log(config.envs.natsServers);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: config.envs.natsServers,
      },
    },
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new CatchAsyncInterceptor(),
  );

  // app.useGlobalFilters(new PrismaClientExceptionFilter());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  await app.listen();
  logger.log(`Product Miscroservice is running...`);
}
bootstrap();
