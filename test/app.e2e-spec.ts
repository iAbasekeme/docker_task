import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { BASE_URL, TEST_PORT } from './config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(TEST_PORT);
    pactum.request.setBaseUrl(BASE_URL);
  });

  it('/ (GET)', () => {
    return pactum.spec().get('/').expectStatus(200).expectBody('Hello World!');
  });
});
