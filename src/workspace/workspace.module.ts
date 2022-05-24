import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CardModule } from 'src/card/card.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceRelationsRepository } from 'src/workspaceRelation/repository/workspaceRelation.repository';
import { CreateWorkspaceTransaction } from './transaction/createWorkspace.transaction';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from './workspace.entity';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, WorkspaceRelationsRepository]),
    UserModule,
    CardModule,
    AuthModule
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, CreateWorkspaceTransaction],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
