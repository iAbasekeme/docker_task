import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import { BookingApprovedEvent } from '../event/booking-approved.event';
import { BookingService } from '../booking.service';
import { Role } from 'src/application/access-control/access-control.constant';

@Injectable()
export class BookingApprovedEventListener {
  logger = new Logger(BookingApprovedEventListener.name);
  constructor(
    private notificationService: NotificationService,
    private bookingService: BookingService,
  ) {}

  @OnEvent(BookingApprovedEvent.eventName)
  async handleBookedEvent(event: BookingApprovedEvent) {
    try {
      await this.sendUserNotification(event);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  private async sendUserNotification(event: BookingApprovedEvent) {
    let { booking } = event.booked;
    booking = await this.bookingService.findOne({ id: booking.id }, [
      'hotel',
      'room',
      'roomCategory',
    ]);

    this.notificationService.send({
      title: `New booking`,
      content: 'new booking',
      channels: [Channel.email],
      recipient: {
        email: booking.guestEmail,
        personId: booking.userId,
        personType: Role.USER
      },
      template: 'new-booking-user',
      sender: { name: 'tracman', id: 'mail@tracman.app' },
      metadata: {
        recipient: booking.guestEmail,
        firstName: booking.guestName,
      },
    });
  }
}
