import './instrument';
import * as Sentry from '@sentry/node';
import * as helmet from 'helmet';
import { Logger } from '@nestjs/common';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { PORT } from './config/env.config';
import { ValidationPipeExt } from './lib/validation-pipe-ext';

function bootstrap() {
  initializeTransactionalContext();
  const logger = new Logger('NestApplication');
  NestFactory.create(AppModule)
    .then(async (app) => {
      const { httpAdapter } = app.get(HttpAdapterHost);
      Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));
      app.enableCors();
      app.use(helmet.default());
      app.use(compression());
      app.useGlobalPipes(
        new ValidationPipeExt({ transform: true, whitelist: true }),
      );
      app.setGlobalPrefix('api');
      app
        .listen(PORT)
        .then(() => {
          logger.log(`listening on port ${PORT}`);
        })
        .catch((error) => {
          logger.error(`error listening on ${PORT} %o`, error);
        });
    })
    .catch((error) => {
      logger.log('error starting app', JSON.stringify(error));
    });
}
bootstrap();
