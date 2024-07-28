import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { RoomCategory } from '../room-category/entities/room-category.entity';
import { RoomAmenity } from '../room-amenity/entities/room-amenity.entity';
import { RoomImage } from '../room-image/entities/room-image.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { HotelRating } from '../../hotel-rating/entities/hotel-rating.entity';
import { PendingReview } from '../../pending-review/entities/pending-review.entity';

export enum RoomAvailabilityStatus {
  available = 'available',
  occupied = 'occupied',
  outOfOrder = 'out-of-order',
}

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;

  @OneToMany(() => RoomAmenity, (amenity) => amenity.room)
  amenities?: RoomAmenity[];

  @Column({ name: 'room_category_id', nullable: false })
  roomCategoryId: string;

  @OneToMany(() => RoomImage, (image) => image.room)
  images?: RoomImage[];

  @OneToMany(() => HotelRating, (rating) => rating.room)
  ratings: HotelRating[];

  @ManyToOne(() => RoomCategory, (cat) => cat.rooms)
  @JoinColumn({ name: 'room_category_id' })
  category: RoomCategory;

  @OneToMany(() => Booking, (booking) => booking.room, {
    onDelete: 'SET NULL',
  })
  bookings?: Booking[];

  @Column({ name: 'cost_amount', nullable: false, type: 'numeric', default: 0 })
  costAmount: number;

  @Column({ name: 'cost_currency', nullable: false, default: 'NGN' })
  costCurrency: string;

  @Column({ nullable: false, default: RoomAvailabilityStatus.available })
  status: RoomAvailabilityStatus;

  @Column({ nullable: false, default: 1 })
  capacity: number;

  @Column({ name: 'room_id', nullable: false })
  roomId: string;

  @Column({ name: 'total_rating', default: 0, nullable: false })
  totalRating: number;

  @Column({ name: 'rating_count', default: 0, nullable: false })
  ratingCount: number;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 5.0,
    nullable: false,
  })
  averageRating: number;

  @Column({ name: 'bed_type', nullable: true })
  bedType?: string;

  @OneToMany(() => PendingReview, (pendingReview) => pendingReview.room)
  pendingReviews: PendingReview[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
