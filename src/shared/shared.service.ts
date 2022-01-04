import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SharedService {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}