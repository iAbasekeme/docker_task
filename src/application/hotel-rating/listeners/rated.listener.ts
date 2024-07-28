import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEmpty, pick } from 'ramda';
import { HotelService } from '../../hotel/hotel.service';
import { RoomService } from '../../room/room.service';
import { HotelRatedEvent } from '../events/rated.event';
import { PendingReview } from '../../pending-review/entities/pending-review.entity';
import { PendingReviewService } from '../../pending-review/pending-review.service';

@Injectable()
export class HotelRatedListener {
  logger = new Logger(HotelRatedListener.name);

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private pendingReviewService: PendingReviewService,
  ) {}

  @OnEvent(HotelRatedEvent.eventName)
  async handleHotelRating(event: HotelRatedEvent) {
    try {
      const rating = event.rating;
      await this.roomService.updateRating(rating);
      await this.hotelService.updateRating(rating);
      await this.clearPendingReview(rating);
    } catch (error) {
      this.logger.error(
        'could not update rating for hotels and rooms',
        { error },
        error?.toString?.(),
      );
    }
  }

  async clearPendingReview(rating: HotelRatedEvent['rating']) {
    try {
      const pendingReviewQuery: Partial<PendingReview> = pick(
        ['bookingId', 'hotelId', 'roomId', 'userId'],
        rating,
      );
      if (!isEmpty(pendingReviewQuery)) {
        await this.pendingReviewService.use(pendingReviewQuery);
      }
    } catch (error) {
      this.logger.error('error', error);
    }
  }
}
