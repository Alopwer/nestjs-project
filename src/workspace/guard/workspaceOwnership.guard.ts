import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { WorkspaceService } from "../workspace.service";

@Injectable()
export class WorkspaceOwnershipGuard implements CanActivate {
  constructor(
    private readonly workspaceService: WorkspaceService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.id;
    const userIsOwner = await this.workspaceService.checkOwner(userId, request.params.id);
    if (!userIsOwner) {
      throw new NotFoundException();
    }
    return true;
  }
}