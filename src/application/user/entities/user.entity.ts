import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Gender } from '../../../common/types';
import { HotelRating } from '../../hotel-rating/entities/hotel-rating.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { UserBookmark } from './user-bookmark.entity';
import { PendingReview } from '../../pending-review/entities/pending-review.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'username', nullable: false, unique: true })
  username?: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, length: 15 })
  gender?: Gender;

  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @OneToMany(() => UserBookmark, (bookmarkedHotel) => bookmarkedHotel.user)
  bookmarks: UserBookmark[];

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: 'phone_number_intl', nullable: true })
  phoneNumberIntl?: string;

  @Column({ name: 'is_email_verified', nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_number_verified', nullable: false, default: false })
  isPhoneNumberVerified: boolean;

  @Column({ name: 'is_waitlist_user', default: false })
  isWaitlistUser?: boolean;

  @Column({ name: 'is_active', default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => HotelRating, (hotelRating) => hotelRating.user)
  ratings?: HotelRating[];

  @OneToMany(() => Booking, (booking) => booking.user, {
    onDelete: 'SET NULL',
  })
  bookings?: Booking[];

  @OneToMany(() => PendingReview, (pendingReview) => pendingReview.user)
  pendingReviews: PendingReview[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail?() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUserName?() {
    if (this.username) {
      this.username = this.username
        .replace(/^@/, '')
        .replace(/\s+/, '_');
    }
  }

  toJSON?() {
    const that = this;
    delete that.toJSON;
    delete that.password;
    return that;
  }
}
