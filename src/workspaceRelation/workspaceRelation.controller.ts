import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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

  @Get('/pending')
  async getPendingWorkspaceRelationRequestsByUserId(
    @Req() { user }: RequestWithUser
  ) {
    return this.workspaceRelationService.getPendingWorkspaceRelationRequestsByUserId(
      user.user_id,
    );
  }

  @Post()
  async createApprovedWorkspaceRelation(
    @Req() { user }: RequestWithUser,
    @Query('workspaceShareCode') workspaceShareCode: string,
  ) {
    if (!workspaceShareCode) {
      throw new BadRequestException('No share code provided');
    }
    return this.workspaceRelationService.createApprovedWorkspaceRelation({
      addresseeId: user.user_id,
      workspaceShareCode,
    });
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
