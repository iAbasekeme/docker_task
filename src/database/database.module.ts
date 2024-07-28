import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { DatasourceConfig, ENABLE_DB_SSL } from '../config/env.config';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static forRoot({
    config,
  }: {
    config: { datasource: DatasourceConfig };
  }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory() {
            return {
              type: 'postgres',
              host: config.datasource.host,
              port: config.datasource.port,
              username: config.datasource.username,
              password: config.datasource.password,
              database: config.datasource.database,
              autoLoadEntities: true,
              entities: [`${__dirname}/../**/*.entity{.js,.ts}`],
              migrations: [__dirname + '/migrations/*{.ts,.js}'],
              synchronize: false,
              logging: true,
              extra: {
                charset: 'utf8mb4_unicode_ci',
              },
              ssl: ENABLE_DB_SSL === 'true',
            };
          },
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error('Invalid options passed');
            }

            return addTransactionalDataSource(new DataSource(options));
          },
        }),
      ],
      providers: [DatabaseService],
      exports: [TypeOrmModule, DatabaseService],
    };
  }
}
