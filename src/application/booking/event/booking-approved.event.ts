import { Hotel } from '../../hotel/entities/hotel.entity';
import { BaseEvent } from '../../../common/types';
import { Booking } from '../entities/booking.entity';

export class BookingApprovedEvent extends BaseEvent<BookingApprovedEventPayload> {
  public static readonly eventName: string = 'booking.approved';
  get booked() {
    return this.payload;
  }
}

export type BookingApprovedEventPayload = {
  booking: Booking;
};
