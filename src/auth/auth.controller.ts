import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RequestWithUser } from "./interface/requestWithUser.interface";
import { Response } from 'express';
import { JwtAuthGuard } from "./guard/jwtAuth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return await this.authService.register(registrationData)
  }

  @Post('log-in')
  @UseGuards(AuthGuard)
  logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.sendStatus(200);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
