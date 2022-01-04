import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { PostService } from "./post.service";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.postService.delete(id);
  }
}