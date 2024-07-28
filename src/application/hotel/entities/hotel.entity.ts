import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentAffiliate } from '../../marketing/entities/agent-affiliate.entity';
import { HotelStaff } from '../../hotel-staff/entities/hotel-staff.entity';
import { HotelImage } from '../image/hotel-image.entity';
import { Room } from '../../room/entities/room.entity';
import { RoomAmenity } from '../../room/room-amenity/entities/room-amenity.entity';
import { RoomCategory } from '../../room/room-category/entities/room-category.entity';
import { HotelRating } from '../../hotel-rating/entities/hotel-rating.entity';
import { Point } from '../../../common/types';
import { Booking } from '../../booking/entities/booking.entity';
import { Bank } from '../../bank-details/entities/bank-detail.entity';
import { UserBookmark } from '../../user/entities/user-bookmark.entity';
import { PendingReview } from '../../pending-review/entities/pending-review.entity';
import { City } from 'src/application/utility/location/entities/city.entity';
import { Country } from 'src/application/utility/location/entities/country.entity';
import { State } from 'src/application/utility/location/entities/state.entity';

@Entity({ name: 'hotels' })
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @OneToMany(() => HotelStaff, (staff) => staff.hotel, { cascade: true })
  staffs?: HotelStaff[];

  @OneToMany(() => Room, (room) => room.hotel, { cascade: true })
  rooms?: Room[];

  @Column({ name: 'owner_id', nullable: true })
  ownerId?: string;

  @OneToMany(() => HotelImage, (hotelImage) => hotelImage.hotel)
  images?: HotelImage[];

  @OneToMany(() => RoomCategory, (cat) => cat.hotel, { cascade: true })
  roomCategories?: RoomCategory[];

  @Column({ name: 'phone_numbers_intl', type: 'json', nullable: true })
  phoneNumbersIntl: string[];

  @OneToMany(() => RoomAmenity, (amenity) => amenity.hotel)
  roomAmenities?: RoomAmenity[];

  @Column({ name: 'affiliate_id', nullable: true })
  affiliateId?: string;

  @OneToMany(() => HotelRating, (HotelRating) => HotelRating.hotel)
  ratings: HotelRating[];

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

  @OneToOne(() => AgentAffiliate, (agentAffiliate) => agentAffiliate.hotel)
  @JoinColumn({ name: 'affiliate_id' })
  agentAffiliate?: AgentAffiliate;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified?: boolean;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: string;

  @ManyToOne(() => City, (c) => c.hotels)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @ManyToOne(() => Country, (c) => c.hotels)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ name: 'state_id', nullable: true })
  stateId: string;

  @ManyToOne(() => State, (s) => s.hotels)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  coordinates?: Point;

  @OneToMany(() => Booking, (booking) => booking.hotel, {
    onDelete: 'SET NULL',
  })
  bookings?: Booking[];

  @OneToMany(() => Bank, (bank) => bank.hotel)
  banks: Bank[];

  @OneToMany(() => UserBookmark, (bookmarked) => bookmarked.hotel)
  bookmarked: UserBookmark[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'approved_at', nullable: true, type: 'timestamptz' })
  approvedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'is_location_verified', default: false })
  isLocationVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => PendingReview, (pendingReview) => pendingReview.hotel)
  pendingReviews: PendingReview[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail?() {
    this.email = this.email.toLowerCase();
  }
}
