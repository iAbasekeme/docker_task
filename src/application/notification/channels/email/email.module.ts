import { DynamicModule, Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { EmailClient } from '../../../gateway/email/email.types';

@Module({})
export class EmailModule {
  static forRoot(config: {
    client: EmailClient;
    global?: boolean;
  }): DynamicModule {
    return {
      module: EmailModule,
      exports: [EmailService],
      providers: [
        {
          provide: EmailService,
          useValue: new EmailService(config.client),
        },
      ],
      global: config.global ?? true,
    };
  }
}
