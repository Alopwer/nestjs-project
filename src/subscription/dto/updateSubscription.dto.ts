import { IsEnum, IsOptional } from "class-validator";
import { PostLimit } from "../enum/postLimit.enum";

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(PostLimit)
  postingLimit?: PostLimit;
}