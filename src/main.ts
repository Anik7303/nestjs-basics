import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
