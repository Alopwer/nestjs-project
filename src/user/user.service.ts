import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { UpdateUserSubscriptionDto } from "./dto/updateUserSubscription.dto";
import { Subscription } from "src/subscription/enum/subscription.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
      subscription: Subscription.Free
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async checkPassword(enteredPwd: string, userPwd: string) {
    const passwordsAreEqual = await bcrypt.compare(enteredPwd, userPwd)
    if (!passwordsAreEqual) {
      throw new UnauthorizedException();
    }
    return passwordsAreEqual;
  }

  async updateSubscription(userId: string, updateSubsciptionDto: UpdateUserSubscriptionDto) {
    // TODO: add payment validation
    await this.userRepository.update(userId, updateSubsciptionDto);
    return await this.userRepository.findOne(userId);
  }
}