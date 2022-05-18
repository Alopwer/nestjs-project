import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { TransformToCamelCaseInterceptor } from './interceptor/transformToCamelCase.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: {
      credentials: true,
      origin: ['http://localhost:8080', 'https://4d3c-95-65-17-139.eu.ngrok.io'] 
    } 
  });
  app.useGlobalInterceptors(new TransformToCamelCaseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
