import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SharedModule } from "../shared/shared.module";

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    SharedModule
  ],
  exports: [JwtModule, SharedModule]
})
export class CoreModule {}