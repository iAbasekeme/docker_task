import { Booking } from 'src/application/booking/entities/booking.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import { Room } from 'src/application/room/entities/room.entity';
import { User } from 'src/application/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'pending_reviews' })
@Unique(['userId', 'bookingId'])
export class PendingReview {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'booking_id', nullable: false })
  bookingId: string;

  @Column({ name: 'hotel_id', nullable: true })
  hotelId?: string;

  @Column({ name: 'room_id', nullable: true })
  roomId?: string;

  @OneToOne(() => Booking, (booking) => booking.pendingReview)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Hotel, (hotel) => hotel.pendingReviews)
  @JoinColumn({name: 'hotel_id'})
  hotel: Hotel

  @ManyToOne(() => Room, (room) => room.pendingReviews)
  @JoinColumn({name: 'room_id'})
  room?: Room

  @ManyToOne(() => User, (user) => user.pendingReviews)
  @JoinColumn({name: 'user_id'})
  user?: User;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
