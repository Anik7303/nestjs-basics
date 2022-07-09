import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { typeOrmConfig } from './typorm.config';

const options: DataSourceOptions = {
  ...(typeOrmConfig as DataSourceOptions),
};

export default new DataSource(options);
