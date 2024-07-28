import { BaseEvent } from '../../../common/types';
import { CheckInCheckOut } from '../entities/check-in-check-out.entity';

export class CheckedOutEvent extends BaseEvent<CheckedOutEventPayload> {
  public static readonly eventName: string = 'checked-in';
  get data() {
    return this.payload;
  }
}

export type CheckedOutEventPayload = {
  checkOut: CheckInCheckOut
};
