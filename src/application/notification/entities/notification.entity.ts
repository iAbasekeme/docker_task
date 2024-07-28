import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutboundNotification } from './outbound-notification.entity';
import { InAppNotification } from '../channels/in-app/entities/in-app-notification.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'text' })
  content?: string;

  @OneToMany(
    () => OutboundNotification,
    (outboundNotification) => outboundNotification.notification,
  )
  outboundNotifications?: OutboundNotification[];

  @OneToMany(
    () => InAppNotification,
    (inAppNotification) => inAppNotification.notification,
  )
  inAppNotifications?: InAppNotification[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
