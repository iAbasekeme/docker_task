import { Hotel } from '../../hotel/entities/hotel.entity';
import { BaseEvent } from '../../../common/types';
import { Booking } from '../entities/booking.entity';

export class BookedEvent extends BaseEvent<BookedEventPayload> {
  public static readonly eventName: string = 'booked';
  get booked() {
    return this.payload;
  }
}

export type BookedEventPayload = {
  booking: Booking;
  hotel: Hotel;
};
