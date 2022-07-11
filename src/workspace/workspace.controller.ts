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
import { CardService } from 'src/card/card.service';
import { CreateCardDto } from 'src/card/dto/createCard.dto';
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
    private readonly cardService: CardService,
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

  @Get(':id/cards')
  @UseGuards(WorkspaceMemberGuard)
  async getAllWorkspaceCards(@Param('id', ParseUUIDPipe) workspaceId: string) {
    return this.cardService.getAllWorkspaceCards(workspaceId);
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
  async createWorkspace(
    @Req() request: RequestWithUser,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    return this.workspaceService.createWorkspace(
      request.user.user_id,
      createWorkspaceDto,
    );
  }

  @Post(':id/cards')
  @UseGuards(WorkspaceMemberGuard)
  async createCard(
    @Param('id', ParseUUIDPipe) workspace_id: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    return this.cardService.createCard({
      workspace_id,
      ...createCardDto,
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
