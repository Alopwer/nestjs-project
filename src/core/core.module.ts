import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SharedModule } from "../shared/shared.module";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: +configService.get('JWT_EXPIRATION_TIME')
        }
      }),
      inject: [ConfigService]
    }),
    SharedModule
  ],
  exports: [JwtModule, SharedModule]
})
export class CoreModule {}