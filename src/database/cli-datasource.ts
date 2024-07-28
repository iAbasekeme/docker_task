import { DataSource } from 'typeorm';

import { datasource, ENABLE_DB_SSL } from '../config/env.config';

export const cliDatasource: DataSource = new DataSource({
  type: 'postgres',
  host: datasource.host,
  port: datasource.port,
  username: datasource.username,
  password: datasource.password,
  database: datasource.database,
  entities: [`${__dirname}/../**/*.entity{.js,.ts}`],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: ENABLE_DB_SSL === 'true',
});
