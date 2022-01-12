import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { PostController } from "./post.controller";
import { PostRepository } from "./post.repository";
import { PostService } from "./post.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    UserModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}