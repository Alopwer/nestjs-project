import {
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
import { CoworkerRelationService } from './coworkerRelation.service';

@Controller('relations/coworkers')
@UseGuards(JwtAuthGuard)
export class CoworkerRelationController {
  constructor(
    private readonly coworkerRelationService: CoworkerRelationService
  ) {}

  @Get('requested')
  async getAllRequestedPendingCoworkerRelations(
    @Req() { user }: RequestWithUser,
    @Query('username') username: string
  ) {
    return this.coworkerRelationService.getAllUsersByRequestedConnections(user.user_id, username)
  }

  @Get('received')
  async getAllReceivedPendingCoworkerRelations(
    @Req() { user }: RequestWithUser,
    @Query('username') username: string
  ) {
    return this.coworkerRelationService.getAllUsersByReceivedConnections(user.user_id, username)
  }

  @Get('approved')
  async getAllApprovedCoworkerRelationsById(@Req() { user }: RequestWithUser, @Query('username') username: string) {
    return this.coworkerRelationService.getAllApprovedCoworkerRelations(
      user.user_id,
      username
    );
  }

  @Post(':id')
  async createCoworkerRelationRequest(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) addresseeId: string,
  ) {
    return this.coworkerRelationService.createCoworkerRelationRequest(
      user.user_id,
      addresseeId,
    );
  }

  @Put(':id')
  async acceptCoworkerRelationRequest(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) requesterId: string,
  ) {
    return this.coworkerRelationService.acceptCoworkerRelationRequest(
      requesterId,
      user.user_id,
    );
  }

  @Delete(':id')
  async deleteCoworkerRelation(
    @Req() { user }: RequestWithUser,
    @Param('id', ParseUUIDPipe) addresseeId: string,
  ) {
    return this.coworkerRelationService.deleteCoworkerRelation(
      user.user_id,
      addresseeId,
    );
  }
}
