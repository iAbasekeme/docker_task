import { BaseEvent } from '../../../common/types';
import { CheckInCheckOut } from '../entities/check-in-check-out.entity';

export class CheckedInEvent extends BaseEvent<CheckedInEventPayload> {
  public static readonly eventName: string = 'checked-in';
  get data() {
    return this.payload;
  }
}

export type CheckedInEventPayload = {
  checkIn: CheckInCheckOut
};
