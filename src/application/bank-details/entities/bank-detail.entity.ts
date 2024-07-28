import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bank_details' })
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'account_name', nullable: false })
  accountName: string;

  @Column({ name: 'account_number', nullable: false })
  accountNumber: string;

  @Column({ name: 'bank_name', nullable: false })
  bankName: string;

  @Column({ name: 'hotel_id', nullable: false })
  hotelId?: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.banks)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ name: 'bank_sort_code', nullable: false })
  bankSortCode: number;

  @Column({ nullable: false })
  default: true | false;
}
