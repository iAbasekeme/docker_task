import { Point } from 'src/common/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.entity';
import { Country } from './country.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'state_id', nullable: false })
  stateId: string;

  @ManyToOne(() => State, (s) => s.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column({ name: 'state_code', nullable: false })
  stateCode: string;

  @Column({ name: 'state_name', nullable: false })
  stateName: string;

  @Column({ name: 'country_id', nullable: false })
  countryId: string;

  @ManyToOne(() => Country, (c) => c.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ name: 'country_code', nullable: false })
  countryCode: string;

  @Column({ name: 'country_name', nullable: false })
  countryName: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  coordinates?: Point;

  @OneToMany(() => Hotel, (h) => h.city)
  hotels: Hotel[];

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;
}
