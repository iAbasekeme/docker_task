import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { Gender } from '../../../common/types';

@Entity({ name: 'hotel_staffs' })
export class HotelStaff {
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

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @Column({ nullable: false, default: 'member' })
  role: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.staffs)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUserName?() {
    if (this.username) {
      this.username = this.username
        .replace(RegExp('^@'), '')
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
