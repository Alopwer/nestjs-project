import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from '../../user/user.service';
import { LogInDto } from '../dto/logIn.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password: enteredPwd } = request.body as LogInDto;
    if (!(email || enteredPwd)) {
      throw new BadRequestException();
    }
    const user = await UserRepository.findUserByEmail(email);;
    const passwordsAreEqual = await this.userService.checkPassword(
      enteredPwd,
      user.password,
    );
    request.user = user;
    return passwordsAreEqual && !!user;
  }
}
