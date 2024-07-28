import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { get } from 'https';

@Injectable()
export class AppService {
  logger = new Logger();
  index() {
    return {
      application: 'Tracman Server API',
      version: '1.0',
      message: 'Server online',
    };
  }

  @Interval(10 * 60 * 1000)
  pingRender() {
    const url = 'https://tracman-api-server.onrender.com/api';

    const req = get(url, (res) => {
      if (res.statusCode === 200) {
        this.logger.log({
          statusCode: 200,
          body: 'Server pinged successfully',
        });
      } else {
        this.logger.error(
          new Error(`Server ping failed with status code: ${res.statusCode}`),
        );
      }
    });

    req.on('error', (error) => {
      this.logger.error(error);
    });

    req.end();
  }
}
