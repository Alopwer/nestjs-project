import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { DecodedToken } from 'src/auth/interface/decodedToken.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUsersByUsername(username: string, userId: string) {
    const users = await this.userRepository.find({ username: ILike(`${username}%`), user_id: Not(userId) });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ user_id: userId });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUsersByIds(userIds: string[]) {
    return this.userRepository.find({ user_id: In(userIds) });
  }

  async getUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.userRepository.find({ user_id: In(userIds), username: ILike(`${username}%`) });
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
