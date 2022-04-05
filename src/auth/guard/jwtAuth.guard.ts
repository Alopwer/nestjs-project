import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";
import { TokenType } from "../enum/tokenType.enum";
import { DecodedToken } from "../interface/decodedToken.interface";
import { RequestWithUser } from "../interface/requestWithUser.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const accessToken = request.cookies.Authentication;
    const decodedToken = await this.authService.verifyToken({ token: accessToken, tokenType: TokenType.ACCESS });
    const user = await this.userService.getUserFromToken(decodedToken);
    request.user = user;
    return !!user;
  }
}