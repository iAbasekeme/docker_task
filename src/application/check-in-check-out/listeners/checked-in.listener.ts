import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import {
  Channel,
  Recipient,
} from 'src/application/notification/notification.type';
import { CheckedInEvent } from '../event/checked-in.event';
import { BookingService } from 'src/application/booking/booking.service';
import { Booking } from 'src/application/booking/entities/booking.entity';
import { Role } from 'src/application/access-control/access-control.constant';

@Injectable()
export class CheckedInEventListener {
  logger = new Logger(CheckedInEventListener.name);
  constructor(
    private notificationService: NotificationService,
    private bookingService: BookingService,
  ) {}

  @OnEvent(CheckedInEvent.eventName)
  async handleCheckedInEvent(event: CheckedInEvent) {
    try {
      const booking = await this.findBooking(event);
      await this.sendNotification(booking);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  private async findBooking(event: CheckedInEvent) {
    return await this.bookingService.findOne(
      {
        id: event.data.checkIn.bookingId,
      },
      ['room', 'hotel'],
    );
  }

  private async sendNotification(booking: Booking) {
    await this.sendUserNotification(booking);
  }

  private async sendUserNotification(booking: Booking) {
    const channels = [Channel.email];
    const recipient: Recipient = { email: booking.guestEmail };

    if (booking.userId) {
      channels.push(Channel.inApp);
      recipient.personId = booking.userId;
      recipient.personType = Role.USER
    }

    this.notificationService.send({
      title: `Check in`,
      content: 'new check in',
      channels,
      recipient,
      template: 'check-in-user',
      sender: { name: 'tracman', id: 'mail@tracman.app' },
      metadata: {
        recipient: booking.guestEmail,
        guestName: booking.guestName,
        ...booking,
      },
    });
  }
}
