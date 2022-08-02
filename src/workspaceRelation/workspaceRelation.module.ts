import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceRelationController } from './workspaceRelation.controller';
import { WorkspaceRelation } from './workspaceRelation.entity';
import { WorkspaceRelationService } from './workspaceRelation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceRelation]),
    UserModule,
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [WorkspaceRelationController],
  providers: [WorkspaceRelationService],
})
export class WorkspaceRelationModule {}
