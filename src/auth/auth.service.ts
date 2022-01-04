import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { SharedService } from "../shared/shared.service";
import { ConfigService } from "@nestjs/config";

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
      const createdUser = this.userService.create({
        ...registrationData,
        password: hashedPassword
      });
      return createdUser;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}