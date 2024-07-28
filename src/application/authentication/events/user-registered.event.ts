import { BaseEvent } from '../../../common/types';
import { User } from '../../user/entities/user.entity';

export class UserRegisteredEvent extends BaseEvent<UserRegisteredEventPayload> {
  public static readonly eventName: string = 'user.registered';
  get user() {
    return this.payload;
  }
}

export type UserRegisteredEventPayload = User & { otpId?: string };
