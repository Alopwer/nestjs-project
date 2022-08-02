import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { DecodedToken } from 'src/auth/interface/decodedToken.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
  // TODO: remove the methods and set userRepository in other services
  async getUserById(userId: string) {
    return this.findUserById(userId);
  }

  async getUserByEmail(email: string) {
    return this.findUserByEmail(email);
  }

  async getUsersByIds(userIds: string[]) {
    return this.findUsersByIds(userIds);
  }

  async getUsersByUsernameWithoutRequester(username: string, userId: string) {
    return this.findUsersByUsernameWithoutRequester(username, userId);
  }

  async getUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.findUsersByIdsAndUsername(userIds, username);
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

  // TODO: create custom repository
  async findUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUsersByIds(userIds: string[]) {
    return this.userRepository.findBy({ user_id: In(userIds) });
  }

  async findUsersByUsernameWithoutRequester(username: string, userId: string) {
    return this.userRepository.findBy({ username: ILike(`${username}%`), user_id: Not(userId) });
  }

  async findUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.userRepository.findBy({ user_id: In(userIds), username: ILike(`${username}%`) });
  }
}
