import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HotelImage } from './hotel-image.entity';

@Injectable()
export class HotelImageRepository extends Repository<HotelImage> {
  constructor(private dataSource: DataSource) {
    super(HotelImage, dataSource.createEntityManager());
  }
}
