import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { UserModule } from "src/user/user.module";
import { Workspace } from "src/workspace/workspace.entity";
import { WorkspaceService } from "src/workspace/workspace.service";
import { WorkspaceRelationController } from "./workspaceRelation.controller";
import { WorkspaceRelation } from "./workspaceRelation.entity";
import { WorkspaceRelationService } from "./workspaceRelation.service";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([WorkspaceRelation, Workspace])
  ],
  controllers: [WorkspaceRelationController],
  providers: [WorkspaceRelationService, AuthService, WorkspaceService],
})
export class WorkspaceRelationModule {}