import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { generateHash, transformPassword } from '../utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // check if email is in use
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('email is in use');
    }

    // hash password
    const hash = await transformPassword(password);
    // create new user and save it
    const user = await this.usersService.create(email, hash);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [storedHash, salt] = user.password.split('.');
    const hash = await generateHash(password, salt);
    if (hash !== storedHash) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
