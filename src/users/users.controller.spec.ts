import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('AuthController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;
  let users: User[];

  beforeEach(async () => {
    users = [];
    fakeUsersService = {
      find: (email: string): Promise<User[]> => {
        const fileteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(fileteredUsers);
      },
      findOne: (id: number): Promise<User> => {
        const user = users.find((user) => user.id === id);
        return Promise.resolve(user);
      },
      update: (id: number, attrs: Partial<User>): Promise<User> => {
        const user = users.find((user) => user.id === id);
        Object.assign(user, attrs);
        return Promise.resolve(user);
      },
      remove: (id: number) => {
        const index = users.findIndex((user) => user.id === id);
        if (index >= 0) {
          const user = users[index];
          users.splice(index, 1);
          return Promise.resolve(user);
        }
        return Promise.reject('user not found');
      },
    };
    fakeAuthService = {
      signin: (email: string, password: string): Promise<User> => {
        const user = users.find((user) => user.email === email);
        if (!user) {
          return Promise.reject('user not found');
        }
        if (password === user.password) {
          return Promise.resolve(user);
        }
        return Promise.reject('bad password');
      },
      signup: (email: string, password): Promise<User> => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    let session;
    let user: User;

    beforeEach(async () => {
      session = {};
      user = await controller.createUser(
        { email: 'test@example.com', password: 'test' },
        session,
      );
    });

    test('creates a new user', async () => {
      expect.assertions(4);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user.email).toEqual('test@example.com');
    });

    test('sets userId to session', async () => {
      expect.assertions(2);
      expect(session).toHaveProperty('userId');
      expect(session.userId).toEqual(user.id);
    });
  });

  describe('signin', () => {
    let email: string;
    let password: string;
    let session: { userId?: number };
    let user: User;

    beforeEach(async () => {
      email = 'test@example.com';
      password = 'test';
      session = {};
      await controller.createUser({ email, password }, {});
      user = await controller.login(
        { email, password },
        {} as Response,
        session,
      );
    });

    test('returns a user', async () => {
      expect.assertions(6);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user.email).toMatch(email);
      expect(user.password).toMatch(password);
    });

    test('sets session with userId', async () => {
      expect.assertions(2);
      expect(session).toHaveProperty('userId');
      expect(session.userId).toEqual(user.id);
    });
  });

  describe('signOut', () => {
    test('sets session.userId to null', async () => {
      const session: { userId?: number } = { userId: 1 };
      await controller.signOut(session);

      expect.assertions(1);
      expect(session.userId).toBeNull();
    });
  });

  describe('whoAmI', () => {
    test('returns current user', async () => {
      const user = await controller.whoAmI({
        id: 1,
        email: 'test@example.com',
        password: 'test',
      } as User);

      expect.assertions(4);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
    });
  });

  describe('listUsers', () => {
    test('returns a list of users with given email', async () => {
      await controller.createUser(
        { email: 'test@example.com', password: 'test' },
        {},
      );
      const users = await controller.listUsers('test@example.com');

      expect.assertions(2);
      expect(users).toHaveLength(1);
      expect(users[0].email).toMatch('test@example.com');
    });
  });

  describe('findUser', () => {
    test('returns a user with given id', async () => {
      const { id } = await controller.createUser(
        { email: 'test@example.com', password: 'test' },
        {},
      );
      const user = await controller.findUser(id.toString());

      expect.assertions(3);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user.id).toEqual(id);
    });
  });

  describe('updateUser', () => {
    test('returns a user with given id', async () => {
      const { id } = await controller.createUser(
        { email: 'test@example.com', password: 'test' },
        {},
      );
      const user = await controller.updateUser(id.toString(), {
        email: 'newtest@example.com',
        password: 'newtest',
      } as UpdateUserDto);

      expect.assertions(7);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user.id).toEqual(id);
      expect(user.email).toMatch('test@example.com');
      expect(user.password).toMatch('newtest');
    });
  });

  describe('deleteUser', () => {
    test('removes user', async () => {
      const { id } = await controller.createUser(
        { email: 'test@example.com', password: 'test' },
        {},
      );
      await controller.deleteUser(id.toString());

      expect.assertions(1);
      expect(users).toHaveLength(0);
    });
  });
});
