import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { CollectionService } from '../collection.service';

@Injectable()
export class CollectionOwnershipGuard implements CanActivate {
  constructor(private readonly collectionService: CollectionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userId = request.user.user_id;
    const userIsOwner = await this.collectionService.checkOwner(
      userId,
      request.params.id,
    );
    if (!userIsOwner) {
      throw new NotFoundException();
    }
    return true;
  }
}
