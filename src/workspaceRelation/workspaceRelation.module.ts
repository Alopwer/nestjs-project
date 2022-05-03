import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceRelationsRepository } from './repository/workspaceRelation.repository';
import { WorkspaceRelationController } from './workspaceRelation.controller';
import { WorkspaceRelationService } from './workspaceRelation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceRelationsRepository]),
    UserModule,
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [WorkspaceRelationController],
  providers: [WorkspaceRelationService],
})
export class WorkspaceRelationModule {}
