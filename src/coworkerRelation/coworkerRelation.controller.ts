import { Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { CoworkerRelationService } from "./coworkerRelation.service";

@Controller('relations/coworkers')
@UseGuards(JwtAuthGuard)
export class CoworkerRelationController {
  constructor(
    private readonly coworkerRelationService: CoworkerRelationService
  ) {}

  @Get()
  async getAllCoworkerRelationsById(@Req() { user }: RequestWithUser) {
    return await this.coworkerRelationService.getAllCoworkerRelationsById(user.user_id);
  }

  @Post(':id')
  async createCoworkerRelationRequest(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) addresseeId: string) {
    return await this.coworkerRelationService.createCoworkerRelationRequest(user.user_id, addresseeId);
  }

  @Put(':id')
  async acceptCoworkerRelationRequest(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) requesterId: string) {
    return await this.coworkerRelationService.acceptCoworkerRelationRequest(requesterId, user.user_id);
  }

  @Delete(':id')
  async deleteCoworker(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) addresseeId: string) {
    return await this.coworkerRelationService.deleteCoworkerRelation(user.user_id, addresseeId);
  }
}