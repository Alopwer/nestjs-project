import { SubscriptionModule } from './subscription/subscription.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { ExceptionsLoggerFilter } from './utils/exceptionLogger.filter';

@Module({
  imports: [
    SubscriptionModule,
    DatabaseModule,
    PostModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CoreModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(PostController)
  }
}
