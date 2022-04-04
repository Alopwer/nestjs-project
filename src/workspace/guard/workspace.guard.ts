import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { WorkspaceService } from "../workspace.service";

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(
    private readonly workspaceService: WorkspaceService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.id;
    return await this.workspaceService.checkOwner(userId, request.params.id);
  }
}