import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from '../entities/hotel.entity';

@Entity({ name: 'hotel_images' })
export class HotelImage {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @Column({ name: 'image_url', nullable: false })
  url: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.images)
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;
}
