import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { WorkspaceController } from "./workspace.controller";
import { Workspace } from "./workspace.entity";
import { WorkspaceService } from "./workspace.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    UserModule
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService]
})
export class WorkspaceModule {}