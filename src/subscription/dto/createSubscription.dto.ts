import { IsEnum } from "class-validator";
import { PostLimit } from "../enum/postLimit.enum";
import { Subscription } from "../enum/subscription.enum";

export class CreateSubscriptionDto {
  @IsEnum(Subscription)
  type: Subscription;

  @IsEnum(PostLimit)
  postingLimit: PostLimit;
}