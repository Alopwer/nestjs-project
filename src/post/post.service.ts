import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { Post } from "./post.entity";
import { PostRepository } from "./post.repository";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository
  ) {}

  async getById(id: string) {
    const post = await this.postRepository.findOne({ id });
    if (post) {
      return post;
    }
    throw new HttpException('Post doesn\'t exist', HttpStatus.NOT_FOUND);
  }

  async getAll(): Promise<Post[]> {
    return await this.postRepository.find({ relations: ['author'] });
  }

  async create(authorId: string, createPostDto: CreatePostDto) {
    const postData = {
      ...createPostDto,
      authorId
    }
    const newPost = this.postRepository.create(postData);
    await this.postRepository.save(postData);
    return newPost;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto)
    return await this.postRepository.findOne({ id })
  }

  async delete(id: string) {
    await this.postRepository.delete(id);
    return { id };
  }
}