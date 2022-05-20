import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  getUsersByUserName(@Query('username') username: string) {
    return this.userService.getUsersByUsername(username)
  }
}
