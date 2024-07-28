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
import { Country } from './country.entity';
import { City } from './city.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'country_id', nullable: false })
  countryId: string;

  @ManyToOne(() => Country, (c) => c.states)
  country: Country;

  @OneToMany(() => City, (c) => c.state)
  cities: City[];

  @Column({ name: 'country_code', nullable: false })
  @JoinColumn({ name: 'country_id' })
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

  @Column({ name: 'state_code', nullable: false })
  stateCode: string;

  @OneToMany(() => Hotel, (h) => h.state)
  hotels: Hotel[];

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;
}
