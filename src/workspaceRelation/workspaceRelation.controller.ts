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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { WorkspaceOwnershipGuard } from 'src/workspace/guard/workspaceOwnership.guard';
import { CreateWorkspaceRelationDto } from './dto/createWorkspaceRelation.dto';
import { WorkspaceRelationService } from './workspaceRelation.service';

@Controller('relations/workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceRelationController {
  constructor(
    private readonly workspaceRelationService: WorkspaceRelationService,
  ) {}

  @Get(':id/pending')
  async getAllPendingWorkspaceRelationRequestsById(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspaceRelationService.getAllPendingWorkspaceRelationRequestsById(
      workspaceId,
      user.user_id,
    );
  }

  @Post(':id')
  @UseGuards(WorkspaceOwnershipGuard)
  async createWorkspaceRelationRequest(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @Body() createWorkspaceRelationDto: CreateWorkspaceRelationDto,
  ) {
    return this.workspaceRelationService.createWorkspaceRelationRequest({
      requesterId: user.user_id,
      workspaceId,
      ...createWorkspaceRelationDto,
    });
  }

  @Put(':id')
  async acceptWorkspaceRelationRequest(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspaceRelationService.acceptWorkspaceRelationRequest(
      workspaceId,
      user.user_id,
    );
  }

  @Delete(':id')
  async deleteWorkspaceRelation(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspaceRelationService.deleteWorkspaceRelation(
      workspaceId,
      user.user_id,
    );
  }
}
