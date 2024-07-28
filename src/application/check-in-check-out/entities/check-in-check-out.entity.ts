import { Booking } from 'src/application/booking/entities/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum CheckInCheckOutType {
  checkedIn = 'checked-in',
  checkedOut = 'checked-out',
  cancelled = 'cancelled',
}

@Entity('check_ins_check_outs')
@Unique(['bookingId', 'type'])
export class CheckInCheckOut {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'booking_id', nullable: false })
  bookingId: string;

  @ManyToOne(() => Booking, (booking) => booking.checkInCheckOuts)
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Column({ name: 'check_in_check_out_type', nullable: false })
  type: CheckInCheckOutType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
