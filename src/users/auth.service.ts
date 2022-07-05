import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

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
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash salt and password together
    const buffer = (await scrypt(password, salt, 32)) as Buffer;
    // join hashed result and salt together
    const hash = `${buffer.toString('hex')}.${salt}`;

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
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
