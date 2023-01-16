declare const module: any;

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { TransformToCamelCaseInterceptor } from './interceptor/transformToCamelCase.interceptor';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ['http://localhost:8080'],
    },
  });
  app.useGlobalInterceptors(new TransformToCamelCaseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  app.use(cookieParser());
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

if (process.env.NODE_ENV === 'development') {
  bootstrap();
}
if (process.env.NODE_ENV === 'production') {
  AppClusterService.clusterize(bootstrap);
}
