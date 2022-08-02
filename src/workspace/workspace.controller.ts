import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { CollectionService } from 'src/collection/collection.service';
import { CreateCollectionDto } from 'src/collection/dto/createCollection.dto';
import { CreateWorkspaceDto } from './dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from './dto/updateWorkspaceDto';
import { WorkspaceMemberGuard } from './guard/workspaceMember.guard';
import { WorkspaceOwnershipGuard } from './guard/workspaceOwnership.guard';
import { Workspace } from './workspace.entity';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly collectionService: CollectionService,
  ) {}

  @Get()
  async getAllOwnerWorkspaces(
    @Req() request: RequestWithUser,
  ): Promise<Workspace[]> {
    return this.workspaceService.getAllOwnerWorkspaces(request.user.user_id);
  }

  @Get('/shared')
  async getAllSharedWorkspaces(
    @Req() request: RequestWithUser,
  ): Promise<Workspace[]> {
    return this.workspaceService.getAllSharedWorkspaces(request.user.user_id);
  }

  @Get(':id/collections')
  @UseGuards(WorkspaceMemberGuard)
  async getAllWorkspaceCollections(@Param('id', ParseUUIDPipe) workspaceId: string) {
    return this.collectionService.getAllWorkspaceCollections(workspaceId);
  }

  @Get(':id/link')
  @UseGuards(WorkspaceOwnershipGuard)
  async getWorkspaceShareCode(
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @Req() { user }: RequestWithUser,
  ) {
    return this.workspaceService.getWorkspaceShareCode(
      workspaceId,
      user.user_id,
    );
  }

  @Post()
  @FormDataRequest()
  async createWorkspace(
    @Req() request: RequestWithUser,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return this.workspaceService.createWorkspace(
      request.user.user_id,
      createWorkspaceDto,
    );
  }

  @Post(':id/collections')
  @UseGuards(WorkspaceMemberGuard)
  async createCollection(
    @Param('id', ParseUUIDPipe) workspace_id: string,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionService.createCollection({
      workspace_id,
      ...createCollectionDto,
    });
  }

  @Put(':id')
  @UseGuards(WorkspaceOwnershipGuard)
  async updateWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @UseGuards(WorkspaceOwnershipGuard)
  async deleteWorkspace(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }
}
