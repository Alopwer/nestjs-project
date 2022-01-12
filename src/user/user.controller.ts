import { Body, Controller, ForbiddenException, Param, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { UpdateUserSubscriptionDto } from "./dto/updateUserSubscription.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async updateSubscription(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
    @Body() updateSubsciptionDto: UpdateUserSubscriptionDto
  ) {
    if (req.user.id !== userId) throw new ForbiddenException();
    return await this.userService.updateSubscription(userId, updateSubsciptionDto);
  }
}