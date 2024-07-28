import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomAmenity } from './entities/room-amenity.entity';

@Injectable()
export class RoomAmenityRepository extends Repository<RoomAmenity> {
  constructor(private dataSource: DataSource) {
    super(RoomAmenity, dataSource.createEntityManager());
  }
}
