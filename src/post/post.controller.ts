import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwtAuth.guard";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { CanCreatePostGuard } from "./guard/canCreatePost.guard";
import { IsOwnPostGuard } from "./guard/isOwnPost.guard";
import { PostService } from "./post.service";

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.postService.getAll();
  }

  @Post()
  @UseGuards(CanCreatePostGuard)
  async create(@Req() req: RequestWithUser, @Body() createPostDto: CreatePostDto) {
    return await this.postService.create(req.user.id, createPostDto);
  }

  @Put(':id')
  @UseGuards(IsOwnPostGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(IsOwnPostGuard)
  async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }
}