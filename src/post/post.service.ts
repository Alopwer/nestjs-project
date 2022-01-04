import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { Post } from "./post.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  getAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  create(createPostDto: CreatePostDto) {
    return this.postRepository.save(createPostDto)
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    this.postRepository.update(id, updatePostDto)
  }

  delete(id: string) {
    this.postRepository.delete(id);
  }
}