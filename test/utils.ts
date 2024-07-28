import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../src/database/database.service';
import { datasource } from '../src/config/env.config';

@Injectable()
export class TestUtils {
  databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR-TEST-UTILS-IS-VALID-ONLY-IN-TEST-ENVIRONMENT');
    }
    this.databaseService = databaseService;
  }

  async getEntities() {
    const entities = [];
    this.databaseService.connection.entityMetadatas.forEach((x) =>
      entities.push({ name: x.name, tableName: x.tableName }),
    );
    return entities;
  }

  async clearDB() {
    const entities = await this.getEntities();
    await this.cleanAll(entities);
  }

  private async cleanAll(entities: { name: string; tableName: string }[]) {
    try {
      await this.databaseService.connection.query(
        `SELECT truncate_tables('${datasource.username}');`,
      );
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }
}
