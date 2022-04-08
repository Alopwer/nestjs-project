import { Controller, Delete, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { UserService } from "./user.service";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post(':id/request')
  async createFriendRequest(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) addresseeId: string) {
    return await this.userService.createFriendRequest(user.id, addresseeId);
  }

  @Put(':id/accept')
  async acceptFriendRequest(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) requesterId: string) {
    return await this.userService.acceptFriendRequest(requesterId, user.id);
  }

  @Put(':id/block')
  async blockUser(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) addresseeId: string) {
    return await this.userService.blockUser(user.id, addresseeId);
  }

  @Delete(':id/delete')
  async deleteFriend(@Req() { user }: RequestWithUser, @Param('id', ParseUUIDPipe) addresseeId: string) {
    return await this.userService.deleteFriend(user.id, addresseeId);
  }
}