import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { TokenType } from '../enum/tokenType.enum';
import { RequestWithUser } from '../interface/requestWithUser.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const refreshToken = request.cookies.RefreshToken;
    const decodedToken = await this.authService.verifyToken({
      token: refreshToken,
      tokenType: TokenType.REFRESH,
    });
    const user = await this.userService.getUserFromToken(decodedToken);
    request.user = user;
    return !!user;
  }
}
