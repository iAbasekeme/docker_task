import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OtpService } from '../../otp/otp.service';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import {
  HotelRegisteredEvent,
  HotelRegisteredEventPayload,
} from '../events/hotel-registered.event';
import { HotelRepository } from '../../hotel/hotel.repository';
import { capitalize } from 'src/lib/utils.lib';

@Injectable()
export class HotelRegisteredListener {
  logger = new Logger(HotelRegisteredListener.name);
  constructor(
    private otpService: OtpService,
    private notificationService: NotificationService,
    private hotelRepository: HotelRepository,
  ) {}

  @OnEvent(HotelRegisteredEvent.eventName)
  async handleHotelRegisteredEvent(event: HotelRegisteredEvent) {
    try {
      const hotelUser = event.hotelUser;
      await this.sendWelcomeNotification(hotelUser);
      await this.tryVerifyAccount(hotelUser);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async tryVerifyAccount(hotelUser: HotelRegisteredEventPayload) {
    const isVerifiedHotelEmail = await Promise.all([
      this.otpService.findVerified(hotelUser.hotel.email),
    ]);
    if (isVerifiedHotelEmail) {
      await this.hotelRepository.save({
        id: hotelUser.hotel.id,
        isEmailVerified: true,
      });
    }
  }

  async sendWelcomeNotification(hotelUser: HotelRegisteredEventPayload) {
    const user = hotelUser.user;
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
        hotelName: capitalize(hotelUser.hotel.name),
        role: hotelUser.staff.role,
      },
    });
  }
}
