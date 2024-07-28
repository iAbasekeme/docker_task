import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class DatabaseService {
  constructor(@InjectDataSource() public readonly connection: DataSource) {}

  getDbHandler(): DataSource {
    return this.connection;
  }
}
