import { Point } from '../../../../common/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.entity';
import { City } from './city.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'country_code_iso3', nullable: false })
  iso3: string;

  @Column({ name: 'country_code_iso2', nullable: false })
  iso2: string;

  @Column({ name: 'numeric_code', nullable: false })
  numericCode: string;

  @Column({ name: 'phone_code', nullable: false })
  phoneCode: string;

  @Column({ nullable: false })
  capital: string;

  @Column({ nullable: false })
  currency: string;

  @Column({ name: 'currency_name', nullable: false })
  currencyName: string;

  @Column({ name: 'currency_symbol', nullable: false })
  currencySymbol: string;

  @Column({ nullable: true, type: 'json' })
  timezones: Timezone[];

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  coordinates?: Point;

  @Column({ nullable: false })
  emoji: string;

  @Column({ nullable: false })
  emojiU: string;

  @OneToMany(() => State, (s) => s.country)
  states: State[];

  @OneToMany(() => Hotel, (h) => h.country)
  hotels: Hotel[];

  @OneToMany(() => City, (c) => c.country)
  cities: City[];

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;
}

export type Timezone = {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
};
