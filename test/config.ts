import { DatabaseModule } from '../src/database/database.module';
import { datasource } from '../src/config/env.config';

export const Database = DatabaseModule.forRoot({ config: { datasource } });

export const TEST_PORT = 8822;
export const BASE_URL = `http://loclhost:${TEST_PORT}/v1`;
