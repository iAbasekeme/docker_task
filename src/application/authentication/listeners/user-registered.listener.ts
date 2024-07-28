import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserRegisteredEvent,
  UserRegisteredEventPayload,
} from '../events/user-registered.event';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import { User } from '../../user/entities/user.entity';
import { OtpService } from 'src/application/otp/otp.service';

@Injectable()
export class UserRegisteredListener {
  logger = new Logger(UserRegisteredListener.name);
  constructor(
    private notificationService: NotificationService,
    private otpService: OtpService,
  ) {}

  @OnEvent(UserRegisteredEvent.eventName)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    try {
      const user = event.user;
      await this.sendWelcomeNotification(user);
      await this.initiateEmailVerification(user);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async initiateEmailVerification(eventPayload: UserRegisteredEventPayload) {
    await this.otpService.initiateOtpVerification(
      {
        email: eventPayload.email,
      },
      eventPayload.otpId,
    );
  }

  async sendWelcomeNotification(user: User) {
    await this.notificationService.send({
      title: 'Welcome',
      content: '',
      channels: [Channel.email],
      recipient: { email: user.email },
      template: 'welcome',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        recipient: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: `@${user.username}`,
      },
    });
  }
}
