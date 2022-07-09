import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { Report } from '../reports/report.entity';
import { User } from '../users/user.entity';

const getDbOptions = () => {
  let dbOptions: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [User, Report],
    migrations: ['migrations/*.js'],
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      break;
    case 'test':
      dbOptions = {
        ...dbOptions,
        migrationsRun: true,
      };
      break;
    case 'production':
      dbOptions = {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      };
      break;
    default:
      throw new Error('unknown environment');
  }

  return dbOptions;
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: getDbOptions,
};

export const typeOrmConfig: TypeOrmModuleOptions = getDbOptions();
