import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindConditions, FindOneOptions, In, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { DecodedToken } from "src/auth/interface/decodedToken.interface";
import { FriendshipStatus } from "./friendship.entity";
import { FriendshipStatusCode } from "./enum/friendshipStatusCode.enum";
import { FriendshipConditions } from "./interface/friendshipConditions.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FriendshipStatus)
    private readonly friendshipStatusRepository: Repository<FriendshipStatus>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserById(id: string) {
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

  async getUserFromToken(decodedToken: DecodedToken) {
    return await this.getUserById(decodedToken.userId);
  }

  async getFriendshipStatus<T>(friendshipConditions: T) {
    const friendshipStatus = await this.friendshipStatusRepository.findOne(friendshipConditions);
    if (!friendshipStatus) {
      throw new NotFoundException();
    }
    return friendshipStatus;
  }

  async createFriendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Are you that alone?');
    }
    let friendshipStatus = null;
    try {
      friendshipStatus = await this.getFriendshipStatus({ addresseeId });
    } catch (e: unknown) {}
    if (friendshipStatus) {
      await this.checkFriendshipStatus(friendshipStatus);
    }
    const friendshipRequest = this.friendshipStatusRepository.create({
      requesterId,
      addresseeId,
      statusCode: FriendshipStatusCode.Requested
    });
    return await this.friendshipStatusRepository.save(friendshipRequest);
  }

  async acceptFriendRequest(requesterId: string, addresseeId: string) {
    const findConditions = { 
      requesterId,
      addresseeId,
      statusCode: FriendshipStatusCode.Requested
    }
    const friendshipStatus = await this.getFriendshipStatus(findConditions);
    friendshipStatus.statusCode = FriendshipStatusCode.Accepted;
    return await this.friendshipStatusRepository.save(friendshipStatus);
  }

  async blockUser(requesterId: string, addresseeId: string) {
    const findConditions: FindOneOptions<FriendshipStatus> = { 
      where: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ]
    }
    const friendshipStatus = await this.getFriendshipStatus(findConditions);
    return await this.friendshipStatusRepository.save({
      ...friendshipStatus,
      statusCode: FriendshipStatusCode.Blocked
    });
  }

  // deletes friend, unblocks, declines
  async deleteFriend(requesterId: string, addresseeId: string) {
    return await this.friendshipStatusRepository
      .createQueryBuilder('friendship')
      .delete()
      .from(FriendshipStatus)
      .where('requesterId = :requesterId AND addresseeId = :addresseeId', { requesterId, addresseeId })
      .orWhere('requesterId = :addresseeId AND addresseeId = :requesterId', { requesterId, addresseeId })
      .execute();
  }

  async checkFriendshipStatus(friendshipStatus: FriendshipStatus) {
    if (friendshipStatus.statusCode === FriendshipStatusCode.Blocked) {
      throw new BadRequestException('This user blocked you.')
    }
    if (friendshipStatus.statusCode === FriendshipStatusCode.Accepted) {
      throw new BadRequestException('You are already friends.')
    }
    if (friendshipStatus.statusCode === FriendshipStatusCode.Requested) {
      throw new BadRequestException('Request already exists.')
    }
  }
}