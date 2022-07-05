import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

import { AppModule } from 'src/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asdfljadfgasb'],
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
