import { Booking } from 'src/application/booking/entities/booking.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import { Room } from 'src/application/room/entities/room.entity';
import { User } from 'src/application/user/entities/user.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity({ name: 'hotel_ratings' })
export class HotelRating {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: false })
  rating: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'room_id', nullable: true })
  roomId: string;

  @Column({ name: 'booking_id', nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, (booking) => booking.ratings)
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @ManyToOne(() => Room, (room) => room.ratings)
  @JoinColumn({ name: 'room_id' })
  room?: Room;

  @Column({ name: 'images', type: 'json', nullable: true })
  images?: any;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.ratings)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ type: 'text', nullable: true })
  review?: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
