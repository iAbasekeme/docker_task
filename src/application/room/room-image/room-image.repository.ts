import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomImage } from './entities/room-image.entity';

@Injectable()
export class RoomImageRepository extends Repository<RoomImage> {
  constructor(private dataSource: DataSource) {
    super(RoomImage, dataSource.createEntityManager());
  }
}
