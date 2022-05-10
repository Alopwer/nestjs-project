import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { CardService } from '../card.service';

@Injectable()
export class CardMemberGuard implements CanActivate {
  constructor(private readonly cardService: CardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.user_id;
    const userIsOwner = await this.cardService.checkOwner(
      userId,
      request.params.id,
    );
    if (userIsOwner) return true;
    const userIsPartOfWorkspace = await this.cardService.checkEditor(
      userId,
      request.params.id,
    );
    if (!userIsPartOfWorkspace) {
      throw new NotFoundException();
    }
    return true;
  }
}
