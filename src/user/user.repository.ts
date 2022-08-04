import { HttpException, HttpStatus } from "@nestjs/common";
import { AppDataSource } from "src/config/data-source";
import { In, ILike, Not } from "typeorm";
import { User } from "./user.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findUserById(userId: string) {
    const user = await this.findOneBy({ user_id: userId });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  },
  async findUserByEmail(email: string) {
    const user = await this.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  },
  async findUsersByIds(userIds: string[]) {
    return this.findBy({ user_id: In(userIds) });
  },
  async findUsersByUsernameWithoutRequester(username: string, userId: string) {
    return this.findBy({ username: ILike(`${username}%`), user_id: Not(userId) });
  },
  async findUsersByIdsAndUsername(userIds: string[], username: string) {
    return this.findBy({ user_id: In(userIds), username: ILike(`${username}%`) });
  },
});
