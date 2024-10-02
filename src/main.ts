import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import * as config from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// console.log(config.envs.natsServers);

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
