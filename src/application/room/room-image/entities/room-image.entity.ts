import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../../entities/room.entity';

@Entity({ name: 'room_images' })
export class RoomImage {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'room_id', nullable: false })
  roomId: string;

  @ManyToOne(() => Room, (room) => room.amenities)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ type: 'text' })
  url: string;

  toJSON?() {
    const that = this;
    delete that.toJSON;
    return that.url;
  }
}
