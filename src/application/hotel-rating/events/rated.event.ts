import { BaseEvent } from 'src/common/types';
import { HotelRating } from '../entities/hotel-rating.entity';

export class HotelRatedEvent extends BaseEvent<HotelRating> {
  public static readonly eventName: string = 'hotel.rated';
  get rating() {
    return this.payload;
  }
}
