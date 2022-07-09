import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  test('handles a signup request', async () => {
    const _email = 'tesgfdhsgst@example.com';
    const {
      body: { id, email },
    } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: _email, password: 'test' })
      .expect(201);

    expect.assertions(2);
    expect(id).toBeDefined();
    expect(email).toMatch(_email);
  });

  test('singup as a new user then get the currently logged in user', async () => {
    const _email = 'fasdlfjanhd@sasfldkja.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: _email, password: 'test' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { id: userId } = res.body;

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect.assertions(6);
    expect(userId).toBeDefined();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email');
    expect(body).not.toHaveProperty('password');
    expect(body.email).toMatch(_email);
    expect(body.id).toEqual(userId);
  });

  afterEach(async () => {
    await app.close();
  });
});
