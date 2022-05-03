import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RequestWithUser } from "./interface/requestWithUser.interface";
import { Response } from 'express';
import { JwtAuthGuard } from "./guard/jwtAuth.guard";
import { RefreshTokenGuard } from "./guard/refreshToken.guard";

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
    const cookies = this.authService.getCookieWithJwtTokens(user.user_id);
    request.res.setHeader('Set-Cookie', [cookies.accessToken, cookies.refreshToken]);
    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  logOut(@Res() response: Response) {
    const cookies = this.authService.getCookieForLogOut();
    response.setHeader('Set-Cookie', [cookies.accessToken, cookies.refreshToken]);
    response.sendStatus(200);
  }

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getAccessTokenCookie({ userId: request.user.user_id });
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    request.res.sendStatus(200);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
