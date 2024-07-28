import { HotelStaff } from 'src/application/hotel-staff/entities/hotel-staff.entity';
import { BaseEvent } from '../../../common/types';
import { User } from '../../user/entities/user.entity';

export class AccountReservedEvent extends BaseEvent<User | HotelStaff> {
  public static readonly eventName: string = 'account.reserved';
  get user() {
    return this.payload;
  }
}
