import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/user.service";
import { DecodedToken } from "../interface/decodedToken.interface";
import { RequestWithUser } from "../interface/requestWithUser.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const jwtToken = request.cookies.Authentication;
    let decodedToken: DecodedToken;
    try {
      decodedToken = await this.jwtService.verifyAsync(jwtToken);
    } catch {
      throw new HttpException('Token is wrong or has expired', HttpStatus.UNAUTHORIZED);
    }
    const { userId } = decodedToken;
    const user = await this.userService.getById(userId);
    request.user = user;
    return !!user;
  }
}