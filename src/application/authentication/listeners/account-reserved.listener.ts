import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import { AccountReservedEvent } from '../events/account-reserved.event';
import { User } from '../../user/entities/user.entity';
import { HotelStaff } from '../../hotel-staff/entities/hotel-staff.entity';

@Injectable()
export class AccountReservedListener {
  logger = new Logger(AccountReservedListener.name);
  constructor(private notificationService: NotificationService) {}

  @OnEvent(AccountReservedEvent.eventName)
  async handleAccountReservedEvent(event: AccountReservedEvent) {
    try {
      const user = event.user;
      await this.sendWelcomeNotification(user);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async sendWelcomeNotification(user: User | HotelStaff) {
    await this.notificationService.send({
      title: "You've been successfully added to the waitlist",
      content: '',
      channels: [Channel.email],
      recipient: { email: user.email },
      template: 'waitlist',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        recipient: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: `@${user.username.replace('@', '')}`,
      },
    });
  }
}
