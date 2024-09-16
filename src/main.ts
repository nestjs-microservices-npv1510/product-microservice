import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import * as config from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: config.envs.port || 3001,
      },
    },
  );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  await app.listen();
  logger.log(`Product Miscroservice is running on port ${config.envs.port}...`);
  // await app.listen(envs.port || 9999, () => {
  //   logger.log(`Server is running on port ${envs.port}`);
  // });
}
bootstrap();
