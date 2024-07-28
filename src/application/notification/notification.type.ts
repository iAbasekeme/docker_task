import { Apps, AtLeastOne } from '../../common/types';
import { Role } from '../access-control/access-control.constant';
import { OutboundNotification } from './entities/outbound-notification.entity';

export abstract class NotificationChannel {
  abstract send(
    recipient: Recipient,
    notification: Omit<NotificationPayload, 'channels' | 'recipient'>,
    outboundNotification?: OutboundNotification
  ): Promise<any>;
}

export enum Channel {
  push = 'push',
  sms = 'sms',
  email = 'email',
  inApp = 'inApp',
}

export type Metadata = {
  [key: string]: any;
};

export enum DeliveryStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export type Recipient = AtLeastOne<{
  deviceId: string;
  topic: string;
  phoneNumber: string;
  email: string;
  inApp: string;
  personId: string
  personType: Role | Apps
}>;

export type Sender = {
  name: string;
  id: string;
};

export type NotificationPayload = {
  title: string;
  content?: string;
  channels: Channel[];
  recipient: Recipient;
  notificationId?: string;
  template?: string;
  sender?: AtLeastOne<Sender>;
  metadata?: Metadata;
};
