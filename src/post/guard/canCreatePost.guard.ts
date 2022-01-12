import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { Subscription } from "src/subscription/enum/subscription.enum";
import { UserService } from "src/user/user.service";
import { PostRepository } from "../post.repository";
import { PostService } from "../post.service";

@Injectable()
export class CanCreatePostGuard implements CanActivate {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.id;
    // TODO: get only today's posts
    const posts = await this.postRepository.getByAuthorAndDate(userId, new Date());
    const user = await this.userService.getById(userId);
    return this.canCreatePost(posts.length, user.subscription);
  }
  
  canCreatePost(createdPostsLength: number, userSubscriptionType: Subscription) {
    if (userSubscriptionType === Subscription.Pro) return true;
    if (userSubscriptionType === Subscription.Basic && createdPostsLength <= 100) return true;
    if (userSubscriptionType === Subscription.Free && createdPostsLength <= 10) return true;
  }
}