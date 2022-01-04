import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { ExceptionsLoggerFilter } from './utils/exceptionLogger.filter';

@Module({
  imports: [
    DatabaseModule,
    PostModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    }
  ],
})
export class AppModule {}
