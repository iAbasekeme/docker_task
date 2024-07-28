import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { OutboundNotification } from '../../../../notification/entities/outbound-notification.entity';
import { Notification } from '../../../../notification/entities/notification.entity';
import { Role } from '../../../../access-control/access-control.constant';
import { Apps } from 'src/common/types';

@Entity({
  name: 'in_app_notifications',
})
export class InAppNotification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'notification_id' })
  notificationId: string;

  @Column({ name: 'person_id', nullable: false, type: 'uuid' })
  personId: string;

  @Column({ name: 'person_type', nullable: false, type: 'character varying' })
  personType: Role | Apps;

  @Column({ name: 'outbound_notification_id', nullable: true })
  outBoundNotificationId?: string;

  @OneToOne(
    () => OutboundNotification,
    (outboundNotification) => outboundNotification.inAppNotification,
  )
  @JoinColumn({ name: 'outbound_notification_id' })
  outboundNotification?: OutboundNotification;

  @Column({ nullable: true })
  readAt?: Date;

  @ManyToOne(
    () => Notification,
    (notification) => notification.inAppNotifications,
  )
  @JoinColumn({ name: 'notification_id' })
  notification?: Notification;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;
}
