import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "../user.entity";
import { ILike, In, Not, EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUserById(userId: string) {
    const user = await this.findOne({ user_id: userId });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUsersByIds(userIds: string[]) {
    return this.find({ user_id: In(userIds) });
  }

  async findUsersByUsernameWithoutRequester(username: string, userId: string) {
    return this.find({ username: ILike(`${username}%`), user_id: Not(userId) });
  }

  async findUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.find({ user_id: In(userIds), username: ILike(`${username}%`) });
  }
}
