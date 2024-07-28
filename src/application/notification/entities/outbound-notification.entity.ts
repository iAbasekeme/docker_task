import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notification } from './notification.entity';
import {
  Channel,
  DeliveryStatus,
  Metadata,
  Recipient,
  Sender,
} from '../notification.type';
import { InAppNotification } from '../channels/in-app/entities/in-app-notification.entity';

@Entity({ name: 'outbound_notifications' })
export class OutboundNotification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'notification_id' })
  notificationId: string;

  @ManyToOne(
    () => Notification,
    (notification) => notification.outboundNotifications,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'notification_id' })
  notification?: Notification;

  @OneToOne(
    () => InAppNotification,
    (inAppNotification) => inAppNotification.outboundNotification,
  )
  inAppNotification?: InAppNotification;

  @Column({ nullable: false })
  channel: Channel;

  @Column({ type: 'json', nullable: false })
  recipient: Recipient;

  @Column({ name: 'retry_count', default: 0, nullable: false })
  retryCount: number;

  @Column({ nullable: true })
  template?: string;

  @Column({ nullable: true, type: 'json' })
  sender?: Sender;

  @Column({ type: 'json', nullable: true })
  metadata?: Metadata;

  @Column({
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'json', nullable: true })
  response?: any

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
