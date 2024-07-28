import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { User } from 'src/application/user/entities/user.entity';

@Entity({ name: 'user_bookmarks' })
@Unique(['hotelId', 'userId'])
export class UserBookmark {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.bookmarked)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ name: 'user_id', nullable: false })
  userId?: string;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
