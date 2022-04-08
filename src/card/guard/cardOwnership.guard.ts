import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { RequestWithUser } from "src/auth/interface/requestWithUser.interface";
import { CardService } from "../card.service";

@Injectable()
export class CardOwnershipGuard implements CanActivate {
  constructor(
    private readonly cardService: CardService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.id;
    const userIsOwner = await this.cardService.checkOwner(userId, request.params.id);
    if (!userIsOwner) {
      throw new NotFoundException();
    }
    return true;
  }
}