import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SharedModule } from "../shared/shared.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`
        }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}