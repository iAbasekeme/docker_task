import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pick } from 'ramda';
import { NotificationService } from '../../notification/notification.service';
import {
  Channel,
  Recipient,
} from '../../notification/notification.type';
import { BookingService } from '../../booking/booking.service';
import { Booking } from '../../booking/entities/booking.entity';
import { CheckedOutEvent } from '../event/checked-out.event';
import { PendingReviewService } from '../../pending-review/pending-review.service';
import { PendingReview } from '../../pending-review/entities/pending-review.entity';
import { Role } from 'src/application/access-control/access-control.constant';

@Injectable()
export class CheckedOutEventListener {
  logger = new Logger(CheckedOutEventListener.name);
  constructor(
    private notificationService: NotificationService,
    private bookingService: BookingService,
    private pendingReviewService: PendingReviewService,
  ) {}

  @OnEvent(CheckedOutEvent.eventName)
  async handleCheckedOutEvent(event: CheckedOutEvent) {
    try {
      const booking = await this.findBooking(event);
      await this.sendNotification(booking);
      await this.createPendingReview(booking);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async createPendingReview(booking: Booking) {
    try {
      if (booking.userId) {
        const data = pick(['userId', 'hotelId', 'roomId'], booking);
        await this.pendingReviewService.create({
          ...data,
          bookingId: booking.id,
        } as PendingReview);
      }
    } catch (error) {}
  }

  private async findBooking(event: CheckedOutEvent) {
    return await this.bookingService.findOne(
      {
        id: event.data.checkOut.bookingId,
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
      content: 'new check out',
      channels,
      recipient,
      template: 'check-out-user',
      sender: { name: 'tracman', id: 'mail@tracman.app' },
      metadata: {
        recipient: booking.guestEmail,
        guestName: booking.guestName,
        ...booking,
      },
    });
  }
}
