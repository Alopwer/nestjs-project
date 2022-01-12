import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { PostService } from "../post.service";

@Injectable()
export class IsOwnPostGuard implements CanActivate {
  constructor(
    private readonly postService: PostService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.id;
    const postId = request.params.id;
    const post = await this.postService.getById(postId);
    const isOwnerOfPost = post.author.id === userId
    if (!isOwnerOfPost) {
      throw new ForbiddenException('Only own posts can be updated');
    }
    return isOwnerOfPost;
  }
}