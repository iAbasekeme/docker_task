import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  DeliveryStatus,
  NotificationChannel,
  NotificationPayload,
  Sender,
} from './notification.type';
import { NotificationRepository } from './notification.repository';
import { OutboundNotificationRepository } from './outboundNotification.repository';
import { OutboundNotification } from './entities/outbound-notification.entity';
import { Notification } from './entities/notification.entity';
import { EmailService } from './channels/email/email.service';
import { InAppNotificationService } from './channels/in-app/in-app-notification.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    private notificationRepository: NotificationRepository,
    private outboundNotificationRepository: OutboundNotificationRepository,
    private email: EmailService,
    private inApp: InAppNotificationService
  ) {}

  async send(notificationPayload: NotificationPayload) {
    this.logger.log('send - notification - ', notificationPayload);
    if (!notificationPayload.channels) {
      throw new BadRequestException('notification channels is required');
    }
    let notification: Notification;
    try {
      notification = await this.logNotification(notificationPayload);
    } catch (error) {
      this.logger.error('could not log notification', error);
      throw error;
    }
    try {
      return await this._send(notification);
    } catch (error) {
      this.logger.error('error sending notification - ', error);
      throw error;
    }
  }

  private async _send(notification: Notification) {
    this.logger.log('sending notification');
    for (let outboundNotification of notification.outboundNotifications) {
      try {
        (this[outboundNotification.channel] as NotificationChannel).send(
          outboundNotification.recipient,
          {
            title: notification.title,
            content: notification.content,
            notificationId: notification.id,
            template: outboundNotification.template,
            sender: outboundNotification.sender,
            metadata: outboundNotification.metadata,
          },
          outboundNotification
        );
        this.logger.log('notification sent successfully');
        await this.outboundNotificationRepository.update(
          { id: outboundNotification.id },
          { status: DeliveryStatus.SUCCESSFUL },
        );
      } catch (error) {
        this.logger.error(
          `notification failed over channel - ${outboundNotification.channel} `,
          error,
        );
        await this.outboundNotificationRepository.update(
          {
            id: outboundNotification.id,
          },
          { status: DeliveryStatus.FAILED, response: error },
        );
      }
    }
  }

  protected async logNotification(notificationPayload: NotificationPayload) {
    const notification = await this.notificationRepository.save({
      title: notificationPayload.title,
      content: notificationPayload.content,
    });

    let outboundNotifications = [];
    for (let channel of notificationPayload.channels) {
      const outboundNotification = new OutboundNotification();
      outboundNotification.notificationId = notification.id;
      outboundNotification.channel = channel;
      outboundNotification.recipient = notificationPayload.recipient;
      if (notificationPayload.template) {
        outboundNotification.template = notificationPayload.template;
      }
      if (notificationPayload.sender) {
        outboundNotification.sender = notificationPayload.sender as Sender;
      }
      if (notificationPayload.metadata) {
        outboundNotification.metadata = notificationPayload.metadata;
      }
      outboundNotifications.push(outboundNotification);
    }

    outboundNotifications = await this.outboundNotificationRepository.save(
      outboundNotifications,
    );
    notification.outboundNotifications = outboundNotifications;

    return notification;
  }
}
