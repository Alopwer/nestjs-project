import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from 'src/auth/auth.module';
import { CollectionModule } from 'src/collection/collection.module';
import { FileService } from 'src/files/file.service';
import { PublicFile } from 'src/files/publicFile.entity';
import { UserModule } from 'src/user/user.module';
import { WorkspaceRelation } from 'src/workspaceRelation/workspaceRelation.entity';
import { CreateWorkspaceTransaction } from './transaction/createWorkspace.transaction';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from './workspace.entity';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, WorkspaceRelation, PublicFile]),
    UserModule,
    CollectionModule,
    AuthModule,
    NestjsFormDataModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, CreateWorkspaceTransaction, FileService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
