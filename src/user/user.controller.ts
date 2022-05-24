import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  getUsersByUserName(@Req() { user }: RequestWithUser, @Query('username') username: string) {
    return this.userService.getUsersByUsername(username, user.user_id)
  }
}
