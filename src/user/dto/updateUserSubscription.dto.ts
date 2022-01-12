import { IsEnum } from "class-validator";
import { Subscription } from "src/subscription/enum/subscription.enum";

export class UpdateUserSubscriptionDto {
  @IsEnum(Subscription)
  subscription: Subscription;
}