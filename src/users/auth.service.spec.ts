import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { transformPassword } from '../utils';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
      fakeUsersService.find = (email: string) =>
        Promise.resolve([
          { id: 1, email: 'test@example.com', password: 'test' },
        ]);

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
    let password = 'test';
    let hashedPassword: string;

    beforeEach(async () => {
      hashedPassword = await transformPassword(password);
      fakeUsersService.find = (email: string) =>
        Promise.resolve([{ id: 1, email, password: hashedPassword } as User]);
    });

    test('throws if signin is called with an unused email', async () => {
      fakeUsersService.find = (email: string) => Promise.resolve([]);

      expect.assertions(2);
      try {
        await service.signin('test@example.com', password);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('user not found');
      }
    });

    test('throws if an invalid password is provided', async () => {
      expect.assertions(2);
      try {
        await service.signin('test@example.com', 'testing');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toMatch('bad password');
      }
    });

    test('signs in successfully', async () => {
      const user = await service.signin('test@example.com', password);

      expect.assertions(4);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
    });
  });
});
