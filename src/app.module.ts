import { CoworkerRelationModule } from './coworkerRelation/coworkerRelation.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './user/user.module';
import { ExceptionsLoggerFilter } from './utils/exceptionLogger.filter';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceRelationModule } from './workspaceRelation/workspaceRelation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CoreModule,
    WorkspaceModule,
    CardModule,
    CoworkerRelationModule,
    WorkspaceRelationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
