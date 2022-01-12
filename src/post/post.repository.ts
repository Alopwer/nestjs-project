import { EntityRepository, Equal, Repository } from "typeorm";
import { Post } from "./post.entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async getByAuthorAndDate(authorId: string, createdAt: Date) {
    return await this.find({ 
      where: {
        createdAt,
        authorId: Equal(authorId)
      } 
    });
  }
}