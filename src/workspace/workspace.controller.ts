import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { CreateWorkspaceDto } from "./dto/createWorkspaceDto";
import { UpdateWorkspaceDto } from "./dto/updateWorkspaceDto";
import { WorkspaceGuard } from "./guard/workspace.guard";
import { Workspace } from "./workspace.entity";
import { WorkspaceService } from "./workspace.service";

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService
  ) {}

  @Get()
  async getAllOwnerWorkspaces(@Req() request: RequestWithUser): Promise<Workspace[]> {
    return await this.workspaceService.getAllOwnerWorkspaces(request.user.id);
  }

  @Post()
  async createWorkspace(@Req() request: RequestWithUser, @Body() createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    return await this.workspaceService.createWorkspace(request.user, createWorkspaceDto);
  }

  @Put(':id')
  @UseGuards(WorkspaceGuard)
  async updateWorkspace(@Param('id', ParseUUIDPipe) id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return await this.workspaceService.updateWorkspace(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @UseGuards(WorkspaceGuard)
  async deleteWorkspace(@Param('id', ParseUUIDPipe) id: string) {
    return await this.workspaceService.deleteWorkspace(id);
  }
}
