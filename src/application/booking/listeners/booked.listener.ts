import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pick, isEmpty } from 'ramda';
import { BookedEvent } from '../event/booked.event';
import { NotificationService } from '../../notification/notification.service';
import { Channel, Recipient } from '../../notification/notification.type';
import { PendingReviewService } from '../../pending-review/pending-review.service';
import { Role } from 'src/application/access-control/access-control.constant';
import { Apps } from 'src/common/types';

@Injectable()
export class BookedEventListener {
  logger = new Logger(BookedEventListener.name);
  constructor(
    private notificationService: NotificationService,
    private pendingReviewService: PendingReviewService,
  ) {}

  @OnEvent(BookedEvent.eventName)
  async handleBookedEvent(event: BookedEvent) {
    try {
      await this.sendNotification(event);
      await this.clearPendingReview(event.booked);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async clearPendingReview(bookedEventPayload: BookedEvent['payload']) {
    try {
      const query = pick(
        ['userId', 'hotelId', 'roomId'],
        bookedEventPayload.booking,
      );
      if (!isEmpty(query)) {
        await this.pendingReviewService.use(query);
      }
    } catch (error) {
      this.logger.error('error', error);
    }
  }

  private async sendNotification(event: BookedEvent) {
    await Promise.all([
      this.sendAdminNotification(event),
      this.sendUserNotification(event),
    ]);
  }

  private async sendAdminNotification(event: BookedEvent) {
    const { booking, hotel } = event.booked;

    this.notificationService.send({
      title: `New booking`,
      content: 'new booking',
      channels: [Channel.email, Channel.inApp],
      recipient: {
        email: hotel.email,
        personId: hotel.id,
        personType: Apps.Hotel,
      },
      template: 'new-booking-admin',
      sender: { name: 'tracman', id: 'mail@tracman.app' },
      metadata: {
        title: `Booking from ${booking.guestName} for ${hotel.name}`,
        recipient: hotel.email,
        guestName: booking.guestName,
        hotelName: String(hotel.name).replace('hotel', ''),
        roomCategoryName: booking.roomCategoryName,
        roomNumber: booking.roomNumber,
        bookingId: booking.referenceId,
        checkInDate: booking.expectedCheckInDate,
        checkOutDate: booking.expectedCheckOutDate,
        bookingStatus: booking.status,
        specialRequest: booking.specialRequest,
        reservationType: booking.reservationType,
      },
    });
  }

  private async sendUserNotification(event: BookedEvent) {
    const { booking, hotel } = event.booked;
    const channels = [Channel.email];
    const recipient: Recipient = { email: booking.guestEmail };

    if (booking.userId) {
      channels.push(Channel.inApp);
      recipient.personId = booking.userId;
      recipient.personType = Role.USER;
    }

    await this.notificationService.send({
      channels,
      recipient,
      title: `Booking for ${hotel.name}`,
      content: 'new booking',
      template: 'new-booking-user',
      sender: { name: 'tracman', id: 'mail@tracman.app' },
      metadata: {
        title: `Booking from ${booking.guestName} for ${hotel.name}`,
        recipient: hotel.email,
        guestName: booking.guestName,
        hotelName: String(hotel.name).replace('hotel', ''),
        roomCategoryName: booking.roomCategoryName,
        roomNumber: booking.roomNumber,
        bookingId: booking.referenceId,
        checkInDate: booking.expectedCheckInDate,
        checkOutDate: booking.expectedCheckOutDate,
        bookingStatus: booking.status,
        specialRequest: booking.specialRequest,
        reservationType: booking.reservationType,
      },
    });
  }
}
