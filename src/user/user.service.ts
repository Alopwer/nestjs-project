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
import { UserRepository } from './user.repository';

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

  async checkPassword(enteredPwd: string, userPwd: string) {
    const passwordsAreEqual = await bcrypt.compare(enteredPwd, userPwd);
    if (!passwordsAreEqual) {
      throw new UnauthorizedException();
    }
    return passwordsAreEqual;
  }

  async getUserFromToken(decodedToken: DecodedToken) {
    return UserRepository.findUserById(decodedToken.userId);
  }
}
