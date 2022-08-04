import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { UserRepository } from './user.repository';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get()
  getUsersByUserName(@Req() { user }: RequestWithUser, @Query('username') username: string) {
    return UserRepository.findUsersByUsernameWithoutRequester(username, user.user_id);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return UserRepository.findUserById(id);
  }
}
