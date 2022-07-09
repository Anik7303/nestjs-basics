import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { typeOrmConfig } from './typorm.config';

const options: DataSourceOptions = {
  ...(typeOrmConfig as DataSourceOptions),
  migrations: [join('migrations', '*.ts')],
};

export default new DataSource(options);
