import { DynamicModule, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { OutboundNotificationRepository } from './outboundNotification.repository';
import { EmailModule } from './channels/email/email.module';
import { RESEND_API_KEY } from '../../config/env.config';
import { InAppNotificationModule } from './channels/in-app/in-app-notification.module';
import { ResendClient } from '../gateway/email/providers/resend';

@Module({})
export class NotificationModule {
  static forRoot(): DynamicModule {
    return {
      module: NotificationModule,
      global: true,
      imports: [
        EmailModule.forRoot({
          client: new ResendClient({ apiKey: RESEND_API_KEY }),
          global: false,
        }),
        InAppNotificationModule,
      ],
      controllers: [NotificationController],
      providers: [
        NotificationService,
        NotificationRepository,
        OutboundNotificationRepository,
      ],
      exports: [NotificationService],
    };
  }
}
