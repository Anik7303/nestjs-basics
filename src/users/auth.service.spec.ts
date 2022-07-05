import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find(email: string): Promise<User[]> {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create(email: string, password: string): Promise<User> {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creates new user', () => {
    test('creates new user', async () => {
      const user = await service.signup('test@example.com', 'test');

      expect.assertions(4);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
    });

    test('password is salted and hashed', async () => {
      const user = await service.signup('test@example.com', 'test');

      expect.assertions(3);
      expect(user.password).not.toEqual('test');

      const [hash, salt] = user.password.split('.');
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
    });

    test('throws error as email is already in use', async () => {
      await service.signup('test@example.com', 'test');

      expect.assertions(2);
      try {
        await service.signup('test@example.com', 'test');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('email is in use');
      }
    });
  });

  describe('login as an existing user', () => {
    test('throws if signin is called with an unused email', async () => {
      fakeUsersService.find = (email: string) => Promise.resolve([]);

      expect.assertions(2);
      try {
        await service.signin('test@example.com', 'test');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('user not found');
      }
    });

    test('throws if an invalid password is provided', async () => {
      await service.signup('test@example.com', 'test');

      expect.assertions(2);
      try {
        await service.signin('test@example.com', 'testing');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toMatch('bad password');
      }
    });

    test('signs in successfully', async () => {
      await service.signup('test@example.com', 'test');
      const user = await service.signin('test@example.com', 'test');

      expect.assertions(4);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
    });
  });
});
