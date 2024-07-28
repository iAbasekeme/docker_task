import { Hotel } from '../../hotel/entities/hotel.entity';
import { BaseEvent } from '../../../common/types';
import { User } from '../../user/entities/user.entity';
import { HotelStaff } from '../../hotel-staff/entities/hotel-staff.entity';

export class HotelRegisteredEvent extends BaseEvent<HotelRegisteredEventPayload> {
  public static readonly eventName: string = 'hotel.registered';
  get hotelUser() {
    return this.payload;
  }
}

export type HotelRegisteredEventPayload = {
  hotel?: Hotel;
  staff?: HotelStaff;
  user?: User;
};
