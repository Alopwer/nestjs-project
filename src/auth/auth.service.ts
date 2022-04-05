import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { SharedService } from "../shared/shared.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/user/user.entity";
import { VerifyToken } from "./interface/verifyToken.interface";
import { DecodedToken } from "./interface/decodedToken.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService
  ) {}

  async register(registrationData: RegisterDto) {
    const hashedPassword = await this.sharedService.hashPassword(registrationData.password)
    try {
      const createdUser = this.userService.createUser({
        ...registrationData,
        password: hashedPassword
      });
      return createdUser;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getCookieWithJwtTokens(userId: string) {
    const payload: TokenPayload = { userId };
    const accessToken = this.getAccessTokenCookie(payload);
    const refreshToken = this.getRefreshTokenCookie(payload);
    return {
      accessToken,
      refreshToken
    }
  }

  getAccessTokenCookie(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: +this.configService.get('JWT_EXPIRATION_TIME')
    })
    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`
  }

  getRefreshTokenCookie(payload: TokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: +this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')
    })
    return `RefreshToken=${refreshToken}; HttpOnly; Path=/auth/refresh-token; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`
  }

  getCookieForLogOut() {
    return {
      accessToken: `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      refreshToken: `RefreshToken=; HttpOnly; Path=/auth/refresh-token; Max-Age=0`
    }
  }

  async verifyToken({ token, tokenType }: VerifyToken): Promise<DecodedToken> {
    let decodedToken: DecodedToken;
    try {
      decodedToken = await this.jwtService.verifyAsync(token, { secret: this.configService.get(tokenType) });
    } catch {
      throw new UnauthorizedException();
    }
    return decodedToken;
  }
}