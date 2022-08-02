import { CoworkerRelationModule } from './coworkerRelation/coworkerRelation.module';
import { Inject, MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './user/user.module';
import { ExceptionsLoggerFilter } from './utils/exceptionLogger.filter';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceRelationModule } from './workspaceRelation/workspaceRelation.module';
import { ClientProxy } from '@nestjs/microservices';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CoreModule,
    WorkspaceModule,
    CollectionModule,
    CoworkerRelationModule,
    WorkspaceRelationModule,
    NestjsFormDataModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    }
  ],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(
    @Inject('LINK_SERVICE') private readonly linkClient: ClientProxy
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }

  async onApplicationBootstrap() {
    try {
      await this.linkClient.connect();
    } catch (e) {
      throw new Error(e)
    }
  }
}
