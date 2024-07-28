import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../entities/room.entity';
import { Hotel } from '../../../hotel/entities/hotel.entity';
import { Booking } from '../../../booking/entities/booking.entity';

@Entity({ name: 'room_categories' })
export class RoomCategory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Room, (room) => room.category, { onDelete: 'SET NULL' })
  rooms?: Room[];

  @OneToMany(() => Booking, (booking) => booking.roomCategory, {
    onDelete: 'SET NULL',
  })
  bookings?: Booking[];

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomCategories)
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;

  @Column({ name: 'cost_amount', nullable: true, type: 'numeric' })
  costAmount?: number;

  @Column({ name: 'cost_currency', nullable: true, default: 'NGN' })
  costCurrency?: string;

  @Column({ nullable: true, type: 'json' })
  images?: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;
}
