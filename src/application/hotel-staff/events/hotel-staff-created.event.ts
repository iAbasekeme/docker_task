import { BaseEvent } from '../../../common/types';
import { User } from '../../user/entities/user.entity';
import { HotelStaff } from '../../hotel-staff/entities/hotel-staff.entity';
import { Hotel } from '../../hotel/entities/hotel.entity';

export class HotelStaffCreatedEvent extends BaseEvent<HotelStaffCreatedEventPayload> {
  public static readonly eventName: string = 'hotel-staff.created';
  get staff() {
    return this.payload;
  }
}

export type HotelStaffCreatedEventPayload = User &
  HotelStaff & { staffId: string; hotel: Hotel };
