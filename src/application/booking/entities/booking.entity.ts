import { CheckInCheckOut } from 'src/application/check-in-check-out/entities/check-in-check-out.entity';
import { HotelRating } from 'src/application/hotel-rating/entities/hotel-rating.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import { PendingReview } from 'src/application/pending-review/entities/pending-review.entity';
import { Room } from 'src/application/room/entities/room.entity';
import { RoomCategory } from 'src/application/room/room-category/entities/room-category.entity';
import { User } from 'src/application/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatus {
  cancelled = 'cancelled',
  pending = 'pending',
  approved = 'approved-payment',
  checkedIn = 'checkedIn',
  checkedOut = 'checkedOut',
}

export enum BookingStatusLevel {
  cancelled = 5,
  pending = 1,
  approved = 2,
  checkedIn = 3,
  checkedOut = 4,
}

@Entity({ name: 'hotel_bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'guest_name', nullable: false })
  guestName: string;

  @Column({ name: 'guest_phone_number_intl', nullable: false })
  guestPhoneNumberIntl: string;

  @Column({ name: 'guest_email', nullable: false })
  guestEmail: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @Column({ name: 'country', nullable: false })
  country?: string;

  @Column({ name: 'number_of_occupants', nullable: false, default: 1 })
  numberOfOccupants: number;

  @Column({ name: 'expected_arrival_date', nullable: false })
  expectedCheckInDate: Date;

  @Column({ name: 'expected_departure_date', nullable: false })
  expectedCheckOutDate: Date;

  @Column({ name: 'duration_days', nullable: false })
  durationDays: number;

  @Column({ name: 'room_category_name', nullable: false })
  roomCategoryName: string;

  @Column({ name: 'room_category_id', nullable: false })
  roomCategoryId: string;

  @ManyToOne(() => RoomCategory, (cat) => cat.bookings)
  @JoinColumn({ name: 'room_category_id' })
  roomCategory: RoomCategory;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.bookings)
  user?: User;

  @ManyToOne(() => Hotel, (hotel) => hotel.bookings)
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;

  @OneToMany(() => HotelRating, (rating) => rating.booking)
  ratings: HotelRating[];

  @Column({ name: 'room_number', nullable: false })
  roomNumber: string;

  @Column({ name: 'room_id', nullable: false })
  roomId: string;

  @Column({ name: 'reservation_type', nullable: false })
  reservationType: string;

  @Column({ name: 'special_request', nullable: true, type: 'json' })
  specialRequest?: string;

  @Column({ type: 'varchar', default: BookingStatus.pending })
  status: BookingStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'reference_id', nullable: false })
  referenceId: string;

  @OneToOne(() => PendingReview, (review) => review.booking)
  pendingReview: PendingReview;

  @OneToMany(
    () => CheckInCheckOut,
    (checkInCheckOut) => checkInCheckOut.booking,
  )
  checkInCheckOuts: CheckInCheckOut[];

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
