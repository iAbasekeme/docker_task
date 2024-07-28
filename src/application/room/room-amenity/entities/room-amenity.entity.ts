import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Room } from '../../entities/room.entity';

@Entity({ name: 'room_amenities' })
@Unique(['name', 'hotelId', 'roomId'])
export class RoomAmenity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'room_id', nullable: true })
  roomId?: string;

  @Column({ name: 'hotel_id', nullable: true })
  hotelId?: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomAmenities)
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;

  @ManyToOne(() => Room, (room) => room.amenities)
  @JoinColumn({ name: 'room_id' })
  room?: Room;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName?() {
    if (this.name) {
      this.name = this.name.toLowerCase();
    }
  }
}
