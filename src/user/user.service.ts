import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ILike, In, Not } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { DecodedToken } from 'src/auth/interface/decodedToken.interface';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserById(userId: string) {
    return this.userRepository.findUserById(userId);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  async getUsersByIds(userIds: string[]) {
    return this.userRepository.findUsersByIds(userIds);
  }

  async getUsersByUsernameWithoutRequester(username: string, userId: string) {
    return this.userRepository.findUsersByUsernameWithoutRequester(username, userId);
  }

  async getUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.userRepository.findUsersByIdsAndUsername(userIds, username);
  }

  async checkPassword(enteredPwd: string, userPwd: string) {
    const passwordsAreEqual = await bcrypt.compare(enteredPwd, userPwd);
    if (!passwordsAreEqual) {
      throw new UnauthorizedException();
    }
    return passwordsAreEqual;
  }

  async getUserFromToken(decodedToken: DecodedToken) {
    return this.getUserById(decodedToken.userId);
  }
}
