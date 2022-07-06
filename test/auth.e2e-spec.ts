import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  test('handles a signup request', () => {
    const _email = 'tesgfdhsgst@example.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: _email, password: 'test' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect.assertions(2);
        expect(id).toBeDefined();
        expect(email).toMatch(_email);
      });
  });
});
