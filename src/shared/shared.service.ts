import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SharedService {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
